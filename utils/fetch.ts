export enum FetchMethodE {
    POST = "POST",
    PUT = "PUT",
    GET = "GET",
    DELETE = "DELETE"
  }
  
  export const fetchData = async ({ url, method, body }: { url: string, method: FetchMethodE, body?: Object }) => {
    const requestOptions: RequestInit = {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
    };
    if (body) {
      requestOptions.body = JSON.stringify(body);
    }
    try {
      const response = await fetch(url, requestOptions);
      if (!response.ok) {
        return { data: null, error: 'Network response was not ok', isLoading:false };    
      }
      const result = await response.json();
      return {data:result, error: false, isLoading: false};
    } catch (error) {  
      return { data: null, error, isLoading:false };
    }
  };
  