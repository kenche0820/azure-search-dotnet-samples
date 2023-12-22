using System;
using Azure;
using Azure.Core.Serialization;
using Azure.Search.Documents;
using Azure.Search.Documents.Indexes;
using Azure.Search.Documents.Indexes.Models;
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

            Console.WriteLine("Kenneth in Search.cs");

            // Azure AI Search 
            Uri serviceEndpoint = new($"https://{searchServiceName}.search.windows.net/");

            SearchClient searchClient = new(
                serviceEndpoint,
                searchIndexName,
                new AzureKeyCredential(searchApiKey)
            );

            FieldBuilder fieldBuilder = new FieldBuilder();
    
            var searchFields = fieldBuilder.Build(typeof(Hotel));
            

            var definition = new SearchIndex(searchIndexName, searchFields);

            var suggester = new SearchSuggester("sg", new[] { "id", "content" });
            definition.Suggesters.Add(suggester);       
            
/*
            SemanticSettings semanticSettings = new SemanticSettings();                       
            semanticSettings.Configurations.Add(new SemanticConfiguration
                (
                    
                    "my-semantic-config",
                    new PrioritizedFields()
                    {
                        TitleField = new SemanticField { FieldName = "id" },
                        ContentFields = {
                        new SemanticField { FieldName = "content" },
                                                },
                        KeywordFields = {
                        new SemanticField { FieldName = "content" },
                        }
                    })
                    
                );

            definition.SemanticSettings = semanticSettings;
*/

            SearchOptions options = new SearchOptions()
            {
                Size = data.Size,
                Skip = data.Skip,
                IncludeTotalCount = true,

  /*              
                QueryType = Azure.Search.Documents.Models.SearchQueryType.Semantic,                
                QueryLanguage = QueryLanguage.EnUs,
                SemanticConfigurationName = "ken-semantic-config",
                QueryCaption = QueryCaptionType.Extractive,
                QueryCaptionHighlightEnabled = true    
*/                
            };

                
        SemanticSearch = new()
        {
            SemanticConfigurationName = "ken-semantic-config",
            QueryCaption = new(QueryCaptionType.Extractive),
            QueryAnswer = new(QueryAnswerType.Extractive)
        },
        QueryType = SearchQueryType.Semantic
    

            SearchResults<SearchDocument> searchResults = searchClient.Search<SearchDocument>(data.SearchText, options);

            // Data to return 
            var output = new SearchOutput
            {
                Count = searchResults.TotalCount,
                Results = searchResults.GetResults().ToList(),
            };
            
            var response = req.CreateResponse(HttpStatusCode.Found);

            // Serialize data
            var serializer = new JsonObjectSerializer(
                new JsonSerializerOptions(JsonSerializerDefaults.Web));
            await response.WriteAsJsonAsync(output, serializer);

            return response;
        }

        public static string CreateFilterExpression(List<SearchFilter> filters)
        {
            if (filters is null or { Count: <= 0 })
            {
                return null;
            }

            List<string> filterExpressions = new();

            return string.Join(" and ", filterExpressions);
        }
    }
}
