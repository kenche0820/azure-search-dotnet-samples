using Azure;
using Azure.Core.Serialization;
using Azure.Search.Documents;
using Azure.Search.Documents.Models;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using System.Net;
using System.Text.Json;
using System.Text.Json.Serialization;
using WebSearch.Models;
using SearchFilter = WebSearch.Models.SearchFilter;

namespace WebSearch.Function
{
    public class Search
    {
        private static string searchApiKey = Environment.GetEnvironmentVariable("SearchApiKey", EnvironmentVariableTarget.Process);
        private static string searchServiceName = Environment.GetEnvironmentVariable("SearchServiceName", EnvironmentVariableTarget.Process);
//        private static string searchIndexName = Environment.GetEnvironmentVariable("SearchIndexName", EnvironmentVariableTarget.Process) ?? "good-books";
        private static string searchIndexName = Environment.GetEnvironmentVariable("SearchIndexName", EnvironmentVariableTarget.Process) ?? "sharepoint-index";

        private readonly ILogger<Lookup> _logger;

        public Search(ILogger<Lookup> logger)
        {
            _logger = logger;
        }

        [Function("search")]
        public async Task<HttpResponseData> RunAsync(
            [HttpTrigger(AuthorizationLevel.Anonymous, "post")] HttpRequestData req, 
            FunctionContext executionContext)
        {
            string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
            var data = JsonSerializer.Deserialize<RequestBodySearch>(requestBody);

            // Azure AI Search 
            Uri serviceEndpoint = new($"https://{searchServiceName}.search.windows.net/");

            SearchClient searchClient = new(
                serviceEndpoint,
                searchIndexName,
                new AzureKeyCredential(searchApiKey)
            );


            Console.WriteLine("Query #3: Invoke semantic search on the same query. This time Triple Landscape is first.\n");
    
//          options = new SearchOptions()
/*
            SearchOptions options = new()
            {
                QueryType = Azure.Search.Documents.Models.SearchQueryType.Semantic,
                QueryLanguage = QueryLanguage.EnUs,
                SemanticConfigurationName = "ken-semantic-config",
                QueryCaption = QueryCaptionType.Extractive,
                QueryCaptionHighlightEnabled = true
            };
*/

 //           options.Select.Add("content");
 //           response = srchclient.Search<Hotel>("what hotel has a good restaurant on site", options);
 //           WriteDocuments(response);


/*
SearchResults response = await searchClient.SearchAsync(
    data.SearchText,
    new SearchOptions
    {
        SemanticSearch = new()
        {
            SemanticConfigurationName = "ken-semantic-config",
            QueryCaption = new(QueryCaptionType.Extractive),
            QueryAnswer = new(QueryAnswerType.Extractive)
        },
        QueryType = SearchQueryType.Semantic
    });
*/
/*
int count = 0;
Console.WriteLine($"Semantic Search Results:");

Console.WriteLine($"\nQuery Answer:");
foreach (QueryAnswerResult result in response.SemanticSearch.Answers)
{
    Console.WriteLine($"Answer Highlights: {result.Highlights}");
    Console.WriteLine($"Answer Text: {result.Text}");
}

await foreach (SearchResult<Hotel> result in response.GetResultsAsync())
{
    count++;
    Hotel doc = result.Document;
 
    if (result.SemanticSearch.Captions != null)
    {
        var caption = result.SemanticSearch.Captions.FirstOrDefault();
        if (caption.Highlights != null && caption.Highlights != "")
        {
            Console.WriteLine($"Caption Highlights: {caption.Highlights}");
        }
        else
        {
            Console.WriteLine($"Caption Text: {caption.Text}");
        }
    }
}
Console.WriteLine($"Total number of search results:{count}");            
*/



  
 /*           SearchOptions options = new()
            {
                Size = data.Size,
                Skip = data.Skip,
                IncludeTotalCount = true,
 //               Filter = CreateFilterExpression(data.Filters)
            };
 //           options.Facets.Add("authors");
 //           options.Facets.Add("language_code");
*/
//            SearchResults<SearchDocument> searchResults = searchClient.Search<SearchDocument>(data.SearchText, options);

/*
            var facetOutput = new Dictionary<string, IList<FacetValue>>();
            foreach (var facetResult in searchResults.Facets)
            {
                facetOutput[facetResult.Key] = facetResult.Value
                           .Select(x => new FacetValue { value = x.Value.ToString(), count = x.Count })

                           .ToList();
            }
*/
 /*
            // Data to return 
            var output = new SearchOutput
            {
                Count = searchResults.TotalCount,
                Results = searchResults.GetResults().ToList(),
 //               Facets = facetOutput
            };
*/
            
            var response = req.CreateResponse(HttpStatusCode.Found);
/*
            // Serialize data
            var serializer = new JsonObjectSerializer(
                new JsonSerializerOptions(JsonSerializerDefaults.Web));
            await response.WriteAsJsonAsync(output, serializer);
*/
            return response;
        }

        public static string CreateFilterExpression(List<SearchFilter> filters)
        {
            if (filters is null or { Count: <= 0 })
            {
                return null;
            }

            List<string> filterExpressions = new();


            List<SearchFilter> authorFilters = filters.Where(f => f.field == "authors").ToList();
            List<SearchFilter> languageFilters = filters.Where(f => f.field == "language_code").ToList();

            List<string> authorFilterValues = authorFilters.Select(f => f.value).ToList();

            if (authorFilterValues.Count > 0)
            {
                string filterStr = string.Join(",", authorFilterValues);
                filterExpressions.Add($"{"authors"}/any(t: search.in(t, '{filterStr}', ','))");
            }

            List<string> languageFilterValues = languageFilters.Select(f => f.value).ToList();
            foreach (var value in languageFilterValues)
            {
                filterExpressions.Add($"language_code eq '{value}'");
            }

            return string.Join(" and ", filterExpressions);
        }
    }
}
