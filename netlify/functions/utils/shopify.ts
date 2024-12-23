import { ShopifyTokenResponse } from '../types';

export async function exchangeShopifyToken(
  shop: string,
  code: string,
  apiKey: string,
  apiSecret: string
): Promise<ShopifyTokenResponse> {
  const response = await fetch(`https://${shop}/admin/oauth/access_token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      client_id: apiKey,
      client_secret: apiSecret,
      code,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Shopify API error:', errorText);
    throw new Error('Failed to get access token');
  }

  return response.json();
}