import { Handler } from '@netlify/functions';
import { config } from './config';
import { validateRequest, validateEnvironment } from './validation';
import { exchangeToken } from './service';
import type { ErrorResponse } from './types';

export const handler: Handler = async (event) => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: config.headers.cors
    };
  }

  // Validate HTTP method
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { ...config.headers.json, ...config.headers.cors },
      body: JSON.stringify({ error: 'Method not allowed' } satisfies ErrorResponse)
    };
  }

  try {
    // Parse and validate request
    const data = JSON.parse(event.body || '{}');
    if (!validateRequest(data)) {
      return {
        statusCode: 400,
        headers: { ...config.headers.json, ...config.headers.cors },
        body: JSON.stringify({ 
          error: 'Invalid request parameters' 
        } satisfies ErrorResponse)
      };
    }

    // Validate environment
    const envValidation = validateEnvironment();
    if (!envValidation.valid) {
      console.error('Environment validation failed:', envValidation.error);
      return {
        statusCode: 500,
        headers: { ...config.headers.json, ...config.headers.cors },
        body: JSON.stringify({ 
          error: 'Server configuration error',
          details: envValidation.error 
        } satisfies ErrorResponse)
      };
    }

    // Exchange token
    const token = await exchangeToken(data.shop, data.code);

    return {
      statusCode: 200,
      headers: {
        ...config.headers.json,
        ...config.headers.cors,
        'Cache-Control': 'no-store'
      },
      body: JSON.stringify(token)
    };
  } catch (error) {
    console.error('Token exchange error:', error);
    return {
      statusCode: 500,
      headers: { ...config.headers.json, ...config.headers.cors },
      body: JSON.stringify({ 
        error: 'Token exchange failed',
        details: error.message 
      } satisfies ErrorResponse)
    };
  }
}