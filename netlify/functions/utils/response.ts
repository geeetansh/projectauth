export function createErrorResponse(statusCode: number, message: string) {
  return {
    statusCode,
    body: JSON.stringify({ error: message }),
  };
}

export function createSuccessResponse(data: unknown) {
  return {
    statusCode: 200,
    body: JSON.stringify(data),
  };
}