export interface Note {
  id: string;
  content: string;
  created_at: string;
}

export interface TokenExchangeResponse {
  access_token: string;
  scope: string;
}