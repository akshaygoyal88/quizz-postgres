export function returnResponse(
    data: any,
    statusCode: number,
    contentType: string
  ): Response {
    return new Response(JSON.stringify(data), {
      status: statusCode,
      headers: {
        "Content-Type": contentType,
      },
    });
  }