import React from 'react';
import Result from './Result/Result';

import "./Results.css";

export default function Results(props) {

            console.log("Kenneth checks props");               
            console.log(props);
            console.log("Kenneth checks count");  
            var propCount;
            propCount = props.documents.length;             
            console.log(propCount);            
//            console.log(`result prop = ${JSON.stringify(props)}`);        

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
              console.log("i: " + i);                             
              console.log("Kenneth checks captions");               
              propResult = props.documents[i]; 
              propCaption = propResult.semanticSearch.captions[0].text;
              console.log(propCaption);                        
              console.log("Kenneth checks score");   
              propScore = propResult.semanticSearch.rerankerScore.toFixed(2);                          
              console.log(propScore);    
              console.log("Kenneth checks filename");   
              propFilename = propResult.document.metadata_spo_item_name                       
              console.log(propFilename);  
              console.log("Kenneth checks content");   
              propContent = propResult.document.content.slice(0,1000) + "...";                    
              console.log(propContent);             

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
