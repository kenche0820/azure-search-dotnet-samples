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

using Microsoft.Graph;
using Microsoft.Identity.Client;

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

//            string searchServiceName = "ken-cog-search-svc";
//            string searchApiKey = "y4IvahCJXDTC3hvDjjlrZZjWsmwmiXrW2iJqv5MgKHAzSeBvYjbF";
//            string searchIndexName = "sharepoint-index";

            // Azure AI Search             
            Uri serviceEndpoint = new Uri($"https://{searchServiceName}.search.windows.net/");
            AzureKeyCredential credential = new AzureKeyCredential(searchApiKey);

            SearchClient searchClient = new SearchClient(serviceEndpoint, searchIndexName, credential);

            FieldBuilder fieldBuilder = new FieldBuilder();
    
            var searchFields = fieldBuilder.Build(typeof(Hotel));
            

            var definition = new SearchIndex(searchIndexName, searchFields);

            var suggester = new SearchSuggester("sg", new[] { "id", "content","metadata_spo_item_name" });
            definition.Suggesters.Add(suggester);       

            definition.SemanticSearch = new SemanticSearch
            {
                Configurations =
                {
                    new SemanticConfiguration("ken-semantic-config", new()
                    {            
                        TitleField = new SemanticField("metadata_spo_item_name"),
                        ContentFields =
                        {
                            new SemanticField("id"),
                            new SemanticField("metadata_spo_item_name"),
                        },                            
                        KeywordsFields =
                        {
                            new SemanticField("id"),      
                            new SemanticField("metadata_spo_item_name"),                                                                                                    
                        }
                    })
                }
            };


        
            SearchOptions options;

            options = new SearchOptions()
            {
                QueryType = Azure.Search.Documents.Models.SearchQueryType.Semantic,
                SemanticSearch = new()
                {
                    SemanticConfigurationName = "ken-semantic-config",
                    QueryCaption = new(QueryCaptionType.Extractive),
                    QueryAnswer = new(QueryAnswerType.Extractive)
                },
                Size = data.Size,
                Skip = data.Skip,
                IncludeTotalCount = true,
            };
            options.Select.Add("id");
            options.Select.Add("metadata_spo_item_name");
            options.Select.Add("content");

/*
            options = new SearchOptions()
            {
                SemanticSearch = new()
                {
                    SemanticConfigurationName = "ken-semantic-config",
                    QueryCaption = new(QueryCaptionType.Extractive)
                }
                Size = data.Size,
                Skip = data.Skip,
                IncludeTotalCount = true,
            };
*/            
            Console.WriteLine("Kenneth is in Search.cs");     


            SearchResults<SearchDocument> searchResults;
            searchResults = searchClient.Search<SearchDocument>(data.SearchText, options);

/*
            foreach (SearchResult<SearchDocument> result in searchResults.GetResults())
            {
                var caption = result.SemanticSearch.Captions.FirstOrDefault();                
                Console.WriteLine($"Caption Text: {caption.Text}");    
                Console.WriteLine(result.Document);
            }
*/
            Console.WriteLine();            

/*
            SearchResults<SearchDocument> response = await searchClient.SearchAsync<SearchDocument>(
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

            foreach (QueryAnswerResult result in response.SemanticSearch.Answers)
            {
                Console.WriteLine($"Answer Highlights: {result.Highlights}");
                Console.WriteLine($"Answer Text: {result.Text}");
            }
*/



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

        

        public static async Task&lt;IActionResult&gt; Run(HttpRequest req, ILogger log)
        {
            string fileId = req.Query["fileId"];

            IConfidentialClientApplication confidentialClientApplication = ConfidentialClientApplicationBuilder
                .Create("&lt;client-id&gt;")
                .WithTenantId("&lt;tenant-id&gt;")
                .WithClientSecret("&lt;client-secret&gt;")
                .Build();

            ClientCredentialProvider authProvider = new ClientCredentialProvider(confidentialClientApplication);

            GraphServiceClient graphClient = new GraphServiceClient(authProvider);

            var permissions = await graphClient.Drives["&lt;drive-id&gt;"].Items[fileId].Permissions
                .Request()
                .GetAsync();

            // TODO: <span class=" active-doc-0" data-doc-items="0">Update the search index with the file permissions<a href="#doc-pos=0" data-tag-index="1"></a></span>.

            return new OkObjectResult(permissions);
        }
   
    }
}
