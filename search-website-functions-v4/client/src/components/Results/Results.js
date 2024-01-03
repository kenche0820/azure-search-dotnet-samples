import React from 'react';
import Result from './Result/Result';

import "./Results.css";

export default function Results(props) {
              console.log("Kenneth checks props");               
              console.log(props);
//            console.log(`result prop = ${JSON.stringif0y(props)}`);

              console.log("Kenneth checks captions");               
              const propResult = props[0]; // or 1? whichever you need;
              console.log(propResult.semanticSearch.captions[0].text);                        


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
            var fileLink = "https://setelab.sharepoint.com/Shared%20Documents/Forms/AllItems.aspx?id=%2FShared%20Documents%2Fdocument%2F";
            var tempFilename = filenameOutput.replace(/_/g, "%5F");
            fileLink += tempFilename.replace(/\./g, "%2E");
            fileLink += "&parent=%2FShared%20Documents%2Fdocument&p=true&ga=1";
//            console.log("Kenneth checks fileLink");              
//            console.log(fileLink);   

/*
            var myTable = "";
            var tempFilenameOutput;
            var tempOutput;
            tempOutput = output;
            
            for (let i = 0; i < 3; i++) {
              pos = tempOutput.indexOf("metadata_spo_item_name"); 
              pos2 = tempOutput.indexOf("\"content\"");  
              console.log ("pos: " + pos + " pos2: " + pos2);
              tempFilenameOutput = tempOutput.slice(pos+25,pos2-2); 
              myTable += "<tr><td><a href='" + tempFilenameOutput + "'>" + tempFilenameOutput + "</a></td></tr>";
              tempOutput = tempOutput.slice(pos2 + 9, tempOutput.length);
              console.log ("tempOutput: " + tempOutput);
            }
*/   
/*         
            var x = document.createElement("TABLE");
            x.setAttribute("id", "myTable");
            document.body.appendChild(x);
          
            var y = document.createElement("TR");
            y.setAttribute("id", "myTr");
            document.getElementById("myTable").appendChild(y);
          
            var z = document.createElement("TD");
            var t = document.createTextNode(filenameOutput);
            z.appendChild(t);
            document.getElementById("myTr").appendChild(z);
*/            

            var x = document.createElement("TABLE");
            x.setAttribute("id", "myTable");
            document.body.appendChild(x);
            var y;
            var tempFilenameOutput;
            var tempOutput;
            tempOutput = output;
            
            for (let i = 0; i < 3; i++) {
              pos = tempOutput.indexOf("metadata_spo_item_name"); 
              pos2 = tempOutput.indexOf("\"content\"");  
              console.log ("pos: " + pos + " pos2: " + pos2);
              tempFilenameOutput = tempOutput.slice(pos+25,pos2-2); 

              y = document.createElement("TR");
              y.setAttribute("id", "myTr");
              document.getElementById("myTable").appendChild(y);
            
              var z = document.createElement("TD");
              var t = document.createTextNode(tempFilenameOutput);
              console.log("i: " + i + "filename: " + tempFilenameOutput);
              z.appendChild(t);
              y.appendChild(z);
              
              tempOutput = tempOutput.slice(pos2 + 9, tempOutput.length);
//              console.log ("tempOutput: " + tempOutput);
            }
              
  
  let results = props.documents.map((result, index) => {
    return <Result 
        key={index} 
        document={result.document}
      />;
  });
  
 // DO NOT COMMENT OUT - get error for unused var 
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
