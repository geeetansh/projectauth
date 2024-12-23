import { getSessionToken } from "@shopify/app-bridge/utilities";
import { useAppBridge } from "@shopify/app-bridge-react";
import { TokenStorage } from './storage';
import { AuthToken } from './types';

export const useShopifySession = () => {
  const app = useAppBridge();

  const refreshToken = async (): Promise<AuthToken | null> => {
    try {
      const token = await getSessionToken(app);
      const authToken: AuthToken = {
        accessToken: token,
        expiresAt: Date.now() + 3600000, // 1 hour expiry
        scope: APP_CONFIG.scopes.join(',')
      };
      
      TokenStorage.save(authToken);
      return authToken;
    } catch (error) {
      console.error('Error refreshing session token:', error);
      return null;
    }
  };

  const getValidToken = async (): Promise<string | null> => {
    const currentToken = TokenStorage.get();
    
    if (currentToken && TokenStorage.isValid(currentToken)) {
      return currentToken.accessToken;
    }

    const newToken = await refreshToken();
    return newToken?.accessToken || null;
  };

  return { getValidToken, refreshToken };
};