export function validateRequestMethod(method: string): boolean {
  return method === 'POST';
}

export function validateRequestBody(shop?: string, code?: string): boolean {
  return Boolean(shop && code);
}