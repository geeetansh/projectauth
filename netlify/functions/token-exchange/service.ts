import { config } from './config';
import { TokenResponse } from './types';

export async function exchangeToken(shop: string, code: string): Promise<TokenResponse> {
  const response = await fetch(config.shopify.tokenEndpoint(shop), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: process.env.VITE_SHOPIFY_API_KEY,
      client_secret: process.env.VITE_SHOPIFY_CLIENT_SECRET,
      code,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Shopify API error:', {
      status: response.status,
      error: errorText,
      shop
    });
    throw new Error(errorText);
  }

  return response.json();
}