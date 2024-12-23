export interface AuthToken {
  accessToken: string;
  expiresAt: number;
  scope: string;
}

export interface AuthError {
  message: string;
  code: string;
}