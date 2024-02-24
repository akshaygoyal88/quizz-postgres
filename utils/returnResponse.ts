export function returnResponse(
    data: ResponseData,
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