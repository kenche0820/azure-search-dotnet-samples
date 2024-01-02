import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CircularProgress  from '@mui/material/CircularProgress';
import { useLocation, useNavigate } from "react-router-dom";

import Results from '../../components/Results/Results';
//import Pager from '../../components/Pager/Pager';
//import Facets from '../../components/Facets/Facets';
import SearchBar from '../../components/SearchBar/SearchBar';

import "./Search.css";

export default function Search() {
  
  let location = useLocation();
  const navigate = useNavigate();
  
  const [ results, setResults ] = useState([]);
 // const [ resultCount, setResultCount ] = useState(0);
  const [ currentPage, setCurrentPage ] = useState(1);
  const [ q, setQ ] = useState(new URLSearchParams(location.search).get('q') ?? "*");
  const [ top ] = useState(new URLSearchParams(location.search).get('top') ?? 8);
  const [ skip, setSkip ] = useState(new URLSearchParams(location.search).get('skip') ?? 0);
  const [ filters, setFilters ] = useState([]);
 // const [ facets, setFacets ] = useState({});
  const [ isLoading, setIsLoading ] = useState(true);

//  let resultsPerPage = top;
  
  useEffect(() => {
    setIsLoading(true);
    setSkip((currentPage-1) * top);
    const body = {
      q: q,
      top: top,
      skip: skip,
      filters: filters
    };

  //  console.log("Kenneth checks variable body")
  //  console.log(body)

    axios.post( '/api/search', body)
      .then(response => {
  //          console.log(JSON.stringify(response.data))
            console.log("Kenneth checks response.data.results");     
            console.log(response.data.results);         
            console.log("Kenneth checks response.data.results.semanticSearch.captions.text");              
            var output = JSON.stringify(response.data.results);                      
            var pos = output.indexOf("text"); 
            var partOutput = output.slice(pos+7,pos+2000);
            var pos2 = partOutput.indexOf("\"highlights\"");             
            var finalOutput = partOutput.slice(0,pos2-2);              
            console.log(finalOutput);    
     
            
            setResults(response.data.results);
 //           setFacets(response.data.facets);
//            setResultCount(response.data.count);
            setIsLoading(false);
        } )
        .catch(error => {
            console.log("Kenneth catches axios error")
            console.log(error);
            setIsLoading(false);
        });
    
  }, [q, top, skip, filters, currentPage]);

  // pushing the new search term to history when q is updated
  // allows the back button to work as expected when coming back from the details page
  useEffect(() => {
    navigate('/search?q=' + q);  
    setCurrentPage(1);
    setFilters([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);


  let postSearchHandler = (searchTerm) => {
    //console.log(searchTerm);
    setQ(searchTerm);
  }

  var body;
  if (isLoading) {
    body = (
      <div className="col-md-9">
        <CircularProgress />
      </div>);
  } else {
    body = (
      <div className="col-md-9">
        <Results documents={results} top={top} skip={skip}></Results>
        
      </div>
    )
  }

  return (
    <main className="main main--search container-fluid">
      
      <div className="row">
        <div className="col-md-3">
          <div className="search-bar">
            <SearchBar postSearchHandler={postSearchHandler} q={q}></SearchBar>
          </div>

        </div>
        {body}
      </div>
    </main>
  );
}
