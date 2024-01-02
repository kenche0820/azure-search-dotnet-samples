import React from 'react';
import Result from './Result/Result';

import "./Results.css";

export default function Results(props) {
//            console.log("Kenneth checks props");               
//            console.log(`result prop = ${JSON.stringify(props)}`);
            var output = JSON.stringify(props);                      
            var pos = output.indexOf("text"); 
            var partOutput = output.slice(pos+7,pos+2000);
            var pos2 = partOutput.indexOf("\"highlights\"");             
            var answerOutput = partOutput.slice(0,pos2-2);  
//            console.log("Kenneth checks answerOutput");              
//            console.log(answerOutput);
            
            pos = output.indexOf("metadata_spo_item_name"); 
            partOutput = output.slice(pos+25,pos+2000);
            pos2 = partOutput.indexOf("\"content\"");             
            var filenameOutput = partOutput.slice(0,pos2-2); 
//            console.log("Kenneth checks filenameOutput");              
//            console.log(filenameOutput);   
            var fileLink = "https://setelab.sharepoint.com/Shared%20Documents/Forms/AllItems.aspx?id=%2FShared%20Documents%2Fdocument%2F"
            fileLink += filenameOutput
            fileLInk += "&parent=%2FShared%20Documents%2Fdocument&p=true&ga=1"
            console.log("Kenneth checks fileLink");              
            console.log(fileLink);   
            
  
  let results = props.documents.map((result, index) => {
    return <Result 
        key={index} 
        document={result.document}
      />;
  });
  
 console.log(results);

//  let beginDocNumber = Math.min(props.skip + 1, props.count);
//  let endDocNumber = Math.min(props.skip + props.top, props.count);

  return (
    <div>
      
      
        <p>{answerOutput}</p>
        <p><a href={fileLink}>{filenameOutput}</a></p>
      
    </div>
  );
};
