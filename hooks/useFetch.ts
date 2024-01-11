'use client';

import { useState, useEffect } from 'react';

export const useFetch = (url: string, time?: number) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // const accessToken = cookies.get('next-auth.session-token');

        // if (!accessToken) {
        //   throw new Error('Access token not found in cookies');
        // }

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const result = await response.json();
        setData(result);
      } catch (error) {
        console.log(error, "jijjjj");
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [url, time]);

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
