import React from 'react';
import Result from './Result/Result';

import "./Results.css";

export default function Results(props) {

//            console.log("Kenneth checks props");               
//            console.log(props);
            var propCount;
            propCount = props.documents.length;             
//            console.log("Kenneth checks count");  
//            console.log(propCount);            
//            console.log(`result prop = ${JSON.stringif0y(props)}`);

            var output = JSON.stringify(props);                      
            var pos = output.indexOf("text"); 
            var partOutput = output.slice(pos+7,pos+2000);
            var pos2 = partOutput.indexOf("\"highlights\"");             
            var answerOutput = partOutput.slice(0,pos2-2);            
            
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

            var x = document.createElement("TABLE");
            x.setAttribute("id", "myTable");
            x.style.border = "1px solid #000";
            x.style.padding = "10px 20px";                   
            document.body.appendChild(x);
            var header = x.createTHead();
            var row = header.insertRow(0);            
            row.style.border = "1px solid #000";    
            var cell0 = row.insertCell(0);
            cell0.innerHTML = "<b>File Name</b>";
            cell0.style.border = "1px solid #000"; 
            var cell1 = row.insertCell(1);
            cell1.innerHTML = "<b>Score</b>";
            cell1.style.border = "1px solid #000";
            var cell2 = row.insertCell(2);
            cell2.innerHTML = "<b>Contents</b>";
            cell2.style.border = "1px solid #000";
            var y;
            var z;
            var t;            
            var propResult;
            var propCaption;
            var propScore;
            var propFilename;
            var propContent;
            var tempLink;
            
            for (let i = 0; i < propCount; i++) {
//              console.log("i: " + i);                             

              propResult = props.documents[i]; 
//              propCaption = propResult.semanticSearch.captions[0].text;
//              console.log("Kenneth checks captions");                             
//              console.log(propCaption);                        
              propScore = propResult.semanticSearch.rerankerScore.toFixed(2);    
//              console.log("Kenneth checks score");                                       
//              console.log(propScore);    
              propFilename = propResult.document.metadata_spo_item_name 
//              console.log("Kenneth checks filename");                                       
//              console.log(propFilename);  
              propContent = propResult.document.content.slice(0,1000) + "...";     
//              console.log("Kenneth checks content");                                
//              console.log(propContent);             

              y = document.createElement("TR");
              y.setAttribute("id", "myTr");
              y.style.borderStyle = "solid";
              document.getElementById("myTable").appendChild(y);
            
              tempLink = document.createElement('a');
              tempLink.textContent = propFilename;
              tempLink.href = "https://setelab.sharepoint.com/Shared%20Documents/Forms/AllItems.aspx?id=%2FShared%20Documents%2Fdocument%2F" + propFilename + "&parent=%2FShared%20Documents%2Fdocument&p=true&ga=1";              
              z = document.createElement("TD");
              z.appendChild(tempLink);
 
              z.style.border = "1px solid #000";         
              y.appendChild(z);
              z = document.createElement("TD");
              z.style.border = "1px solid #000";
              t = document.createTextNode(propScore);              
              z.appendChild(t);
              y.appendChild(z);
              z = document.createElement("TD");
              t = document.createTextNode(propContent); 
              z.style.border = "1px solid #000";            
              z.appendChild(t);
              y.appendChild(z);
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
