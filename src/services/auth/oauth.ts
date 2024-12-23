import { APP_CONFIG } from '../../config/shopifyConfig';
import { verifyHmac } from './hmac';
import { TokenStorage } from './storage';
import type { AuthToken } from './types';

const VALID_SHOP_REGEX = /^[a-zA-Z0-9][a-zA-Z0-9\-]*\.myshopify\.com$/;
const STATE_KEY = 'shopify_oauth_state';

export class ShopifyAuth {
  static validateShop(shop: string): boolean {
    return VALID_SHOP_REGEX.test(shop);
  }

  static getAuthUrl(shop: string): string {
    const state = crypto.randomUUID();
    sessionStorage.setItem(STATE_KEY, state);

    const params = new URLSearchParams({
      client_id: APP_CONFIG.apiKey,
      scope: APP_CONFIG.scopes.join(','),
      redirect_uri: `${window.location.origin}/auth/callback`,
      state,
      shop
    });

    return `https://${shop}/admin/oauth/authorize?${params.toString()}`;
  }

  static async validateCallback(searchParams: URLSearchParams): Promise<boolean> {
    try {
      const state = searchParams.get('state');
      const savedState = sessionStorage.getItem(STATE_KEY);
      sessionStorage.removeItem(STATE_KEY);

      if (!state || state !== savedState) {
        console.error('State mismatch');
        return false;
      }

      const shop = searchParams.get('shop');
      if (!shop || !this.validateShop(shop)) {
        console.error('Invalid shop domain');
        return false;
      }

      const isValidHmac = await verifyHmac(new URLSearchParams(searchParams.toString()), APP_CONFIG.clientSecret);
      if (!isValidHmac) {
        console.error('Invalid HMAC');
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error validating callback:', error);
      return false;
    }
  }

  static async getAccessToken(shop: string, code: string): Promise<AuthToken | null> {
    try {
      const response = await fetch('/.netlify/functions/token-exchange', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ shop, code }),
      });

      if (!response.ok) {
        throw new Error('Failed to get access token');
      }

      const data = await response.json();
      
      const token: AuthToken = {
        accessToken: data.access_token,
        scope: data.scope,
        expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
      };

      TokenStorage.save(token);
      return token;
    } catch (error) {
      console.error('Error getting access token:', error);
      return null;
    }
  }
}