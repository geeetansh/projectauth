export interface TokenExchangeRequest {
  shop: string;
  code: string;
}

export interface ShopifyTokenResponse {
  access_token: string;
  scope: string;
}