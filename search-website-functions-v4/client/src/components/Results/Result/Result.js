import React from 'react';

import './Result.css';

export default function Result(props) {
    
 //   console.log(`result prop = ${JSON.stringify(props)}`)
 //   console.log(props.document.content)
        console.log(props.semanticSearch.rerankerScore)
    
    return(
    <div className="card result">
                 
            <div className="card-body">
                {props.document.content}
            </div>
        
    </div>
    );
}
