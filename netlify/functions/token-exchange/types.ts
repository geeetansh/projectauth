export interface TokenRequest {
  shop: string;
  code: string;
}

export interface TokenResponse {
  access_token: string;
  scope: string;
}

export interface ErrorResponse {
  error: string;
}