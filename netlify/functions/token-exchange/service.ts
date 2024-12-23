import { TokenRequest, TokenResponse } from './types';

export async function exchangeToken(shop: string, code: string): Promise<TokenResponse> {
  const response = await fetch(`https://${shop}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: process.env.VITE_SHOPIFY_API_KEY,
      client_secret: process.env.VITE_SHOPIFY_CLIENT_SECRET,
      code,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('Shopify token exchange failed:', error);
    throw new Error('Failed to exchange token with Shopify');
  }

  return response.json();
}

export function validateRequest(data: any): data is TokenRequest {
  return typeof data?.shop === 'string' && 
         typeof data?.code === 'string' && 
         data.shop.includes('.myshopify.com');
}