import { TokenRequest } from './types';

export function validateRequest(data: unknown): data is TokenRequest {
  if (!data || typeof data !== 'object') return false;
  
  const { shop, code } = data as TokenRequest;
  return Boolean(
    shop && 
    code && 
    typeof shop === 'string' && 
    typeof code === 'string'
  );
}

export function validateEnvironment(): { valid: boolean; error?: string } {
  const apiKey = process.env.VITE_SHOPIFY_API_KEY;
  const apiSecret = process.env.VITE_SHOPIFY_CLIENT_SECRET;

  if (!apiKey || !apiSecret) {
    return {
      valid: false,
      error: 'Missing required environment variables'
    };
  }

  return { valid: true };
}