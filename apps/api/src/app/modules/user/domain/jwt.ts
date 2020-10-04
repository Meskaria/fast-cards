export interface JWTClaims {
  userId: string;
  isEmailVerified: boolean;
  email: string;
}

export type JWTToken = string;

export type SessionId = string;

export type RefreshToken = string;
