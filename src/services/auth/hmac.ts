// Browser-compatible HMAC-SHA256 verification
async function hmacSha256(message: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const messageData = encoder.encode(message);

  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign(
    'HMAC',
    cryptoKey,
    messageData
  );

  // Convert to hex string
  return Array.from(new Uint8Array(signature))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

export const verifyHmac = async (query: URLSearchParams, secret: string): Promise<boolean> => {
  const hmac = query.get('hmac');
  if (!hmac) return false;

  // Remove hmac from query
  query.delete('hmac');

  // Sort parameters
  const params = Array.from(query.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join('&');

  // Calculate hash
  const calculatedHmac = await hmacSha256(params, secret);
  
  // Constant-time comparison to prevent timing attacks
  return calculatedHmac === hmac;
};