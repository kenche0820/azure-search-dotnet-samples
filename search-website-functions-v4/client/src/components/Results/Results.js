import React from 'react';
import Result from './Result/Result';

import "./Results.css";

export default function Results(props) {

//     console.log(`result prop = ${JSON.stringify(props)}`)
            console.log("Kenneth checks props");               
            var output = JSON.stringify(props);                      
            var pos = output.indexOf("text"); 
            var partOutput = output.slice(pos+7,pos+2000);
            var pos2 = partOutput.indexOf("\"highlights\"");             
            var finalOutput = partOutput.slice(0,pos2-2);              
            console.log(finalOutput);    
     
  
  let results = props.documents.map((result, index) => {
    return <Result 
        key={index} 
        document={result.document}
      />;
  });
  
 results = results;

//  let beginDocNumber = Math.min(props.skip + 1, props.count);
//  let endDocNumber = Math.min(props.skip + props.top, props.count);

  return (
    <div>
      
      <div className="row row-cols-md-5 results">
        {finalOutput}
        
      </div>
    </div>
  );
};
