using System;
using System.Text.Json.Serialization;
using Azure.Search.Documents.Indexes;
using Azure.Search.Documents.Indexes.Models;

namespace WebSearch.Function
{
    public partial class Hotel
    {
        [SimpleField(IsKey = true, IsFilterable = true)]
        public string id { get; set; }

        [SearchableField(AnalyzerName = LexicalAnalyzerName.Values.EnLucene)]
        public string content { get; set; }

            }
}
