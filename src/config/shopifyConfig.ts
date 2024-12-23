// Required scopes for the app
export const SCOPES = [
  'read_products',  // View products
  'write_products', // Modify products
  'read_orders',    // View orders
  'write_orders',   // Modify orders
] as const;

// App configuration
export const APP_CONFIG = {
  apiKey: import.meta.env.VITE_SHOPIFY_API_KEY,
  clientSecret: import.meta.env.VITE_SHOPIFY_CLIENT_SECRET,
  appUrl: import.meta.env.VITE_SHOPIFY_APP_URL,
  scopes: SCOPES,
} as const;

// Auth configuration
export const AUTH_CONFIG = {
  accessMode: 'online' as const,
  authPath: '/auth',
  callbackPath: '/auth/callback',
};