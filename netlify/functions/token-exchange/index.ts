import { config } from './config';
import { validateRequest, exchangeToken } from './service';
import type { TokenResponse, ErrorResponse } from './types';

export default async function handler(req: Request): Promise<Response> {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: config.headers.cors
    });
  }

  // Validate request method
  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' } satisfies ErrorResponse),
      {
        status: 405,
        headers: { ...config.headers.json, ...config.headers.cors }
      }
    );
  }

  try {
    const data = await req.json();

    // Validate request body
    if (!validateRequest(data)) {
      return new Response(
        JSON.stringify({ error: 'Invalid request parameters' } satisfies ErrorResponse),
        {
          status: 400,
          headers: { ...config.headers.json, ...config.headers.cors }
        }
      );
    }

    // Exchange token
    const token = await exchangeToken(data.shop, data.code);

    // Return success response
    return new Response(
      JSON.stringify(token satisfies TokenResponse),
      {
        status: 200,
        headers: {
          ...config.headers.json,
          ...config.headers.cors,
          'Cache-Control': 'no-store'
        }
      }
    );
  } catch (error) {
    console.error('Token exchange error:', error);
    
    return new Response(
      JSON.stringify({ error: 'Token exchange failed' } satisfies ErrorResponse),
      {
        status: 500,
        headers: { ...config.headers.json, ...config.headers.cors }
      }
    );
  }
}