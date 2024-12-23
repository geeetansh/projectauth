import { Context } from "@netlify/functions";

export default async function handler(req, context) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      }
    });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const { shop, code } = await req.json();
    
    if (!shop || !code) {
      return new Response(JSON.stringify({ error: 'Missing required parameters: shop and code' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Use Netlify.env to access environment variables
    const apiKey = Netlify.env.get("VITE_SHOPIFY_API_KEY");
    const apiSecret = Netlify.env.get("VITE_SHOPIFY_CLIENT_SECRET");

    if (!apiKey || !apiSecret) {
      console.error('Missing required environment variables');
      return new Response(JSON.stringify({ error: 'Server configuration error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

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
      return new Response(JSON.stringify({ error: 'Failed to exchange token with Shopify' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const data = await response.json();
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store' // Prevent caching of sensitive data
      }
    });
  } catch (error) {
    console.error('Token exchange error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}