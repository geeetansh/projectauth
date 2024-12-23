import { AuthToken } from './types';

const TOKEN_KEY = 'shopify_token';

export const TokenStorage = {
  save: (token: AuthToken) => {
    sessionStorage.setItem(TOKEN_KEY, JSON.stringify(token));
  },

  get: (): AuthToken | null => {
    const token = sessionStorage.getItem(TOKEN_KEY);
    return token ? JSON.parse(token) : null;
  },

  clear: () => {
    sessionStorage.removeItem(TOKEN_KEY);
  },

  isValid: (token: AuthToken): boolean => {
    return token.expiresAt > Date.now();
  }
};