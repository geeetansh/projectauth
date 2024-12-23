import { getSessionToken } from "@shopify/app-bridge/utilities";
import { useAppBridge } from "@shopify/app-bridge-react";

export const useShopifyAuth = () => {
  const app = useAppBridge();

  const getToken = async () => {
    try {
      const token = await getSessionToken(app);
      sessionStorage.setItem('shopifyAccessToken', token);
      return token;
    } catch (error) {
      console.error('Error getting session token:', error);
      return null;
    }
  };

  return { getToken };
};