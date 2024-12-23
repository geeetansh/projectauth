import { Handler } from '@netlify/functions';

export const handler: Handler = async (event) => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      }
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
      headers: { 'Content-Type': 'application/json' }
    };
  }

  try {
    const { shop, code } = JSON.parse(event.body || '{}');
    
    if (!shop || !code) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required parameters: shop and code' }),
        headers: { 'Content-Type': 'application/json' }
      };
    }

    const apiKey = process.env.VITE_SHOPIFY_API_KEY;
    const apiSecret = process.env.VITE_SHOPIFY_CLIENT_SECRET;

    if (!apiKey || !apiSecret) {
      console.error('Missing required environment variables');
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Server configuration error' }),
        headers: { 'Content-Type': 'application/json' }
      };
    }

    console.log('Making request to Shopify with:', {
      shop,
      apiKey,
      hasSecret: !!apiSecret
    });

    const response = await fetch(`https://${shop}/admin/oauth/access_token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: apiKey,
        client_secret: apiSecret,
        code,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Shopify API error:', errorText);
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: 'Failed to exchange token with Shopify', details: errorText }),
        headers: { 'Content-Type': 'application/json' }
      };
    }

    const data = await response.json();
    return {
      statusCode: 200,
      body: JSON.stringify(data),
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store'
      }
    };
  } catch (error) {
    console.error('Token exchange error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error', details: error.message }),
      headers: { 'Content-Type': 'application/json' }
    };
  }
}