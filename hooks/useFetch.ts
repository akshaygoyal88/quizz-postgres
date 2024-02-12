"use client";

import pathName from "@/constants";
import { FetchMethodE, fetchData } from "@/utils/fetch";
import { useState, useEffect, useCallback } from "react";

export const useFetch = ({ url }: { url: string }) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const getData = async () => {
    const { data, error, isLoading } = await fetchData({
      url,
      method: FetchMethodE.GET
    });
    setData(data);
    setError(error);
    setIsLoading(isLoading);
  };

  useEffect(() => {
    getData();
  }, [url]);

  return { data, error, isLoading };
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
