'use client';

import { useState, useEffect, useCallback } from 'react';

export enum FetchMethodE {
  POST="POST",
  PUT="PUT",
  GET="GET",
  DELETE="DELETE"
}

export const useFetch = ({url, method}:{url: string, method:FetchMethodE }) => {  
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async (body?: Object) => {
    const requestOptions: RequestInit = {
      method: FetchMethodE[method],
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (body) {
      requestOptions.body = JSON.stringify(body);
    }
    // console.log(url, body, "Getting data...");
    const response = await fetch(url, requestOptions);

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const result = await response.json();
    setData(result);
  }, [url])
   
  useEffect(() => {    
    if (method === FetchMethodE.GET) {
      // console.log("get", fetchData)
      fetchData();
    }
  }, [url, method]);

  console.log(url, method)

  return { data, error, isLoading, fetchData };
};

// // Example usage in a component
// const YourComponent = () => {
//   const apiUrl = 'https://api.example.com/data';

//   const { data, error, isLoading } = useApiFetch(apiUrl);

//   if (isLoading) {
//     return <p>Loading...</p>;
//   }

//   if (error) {
//     return <p>Error: {error.message}</p>;
//   }

//   return (
//     <div>
//       <h1>Data from API</h1>
//       <pre>{JSON.stringify(data, null, 2)}</pre>
//     </div>
//   );
// };

// export default YourComponent;
