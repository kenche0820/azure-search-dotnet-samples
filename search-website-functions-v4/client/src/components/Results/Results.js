import React from 'react';
//import Result from './Result/Result';

import "./Results.css";

export default function Results(props) {

  /*
  let results = props.documents.map((result, index) => {
    return <Result 
        key={index} 
        document={result.document}
      />;
  });
  */
 let results = props;

//  let beginDocNumber = Math.min(props.skip + 1, props.count);
//  let endDocNumber = Math.min(props.skip + props.top, props.count);

  return (
    <div>
      
      <div className="row row-cols-md-5 results">
        {results}
      </div>
    </div>
  );
};
