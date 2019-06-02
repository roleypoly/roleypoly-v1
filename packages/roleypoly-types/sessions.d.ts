
export declare type BaseSession = {
  userId: string,
  expiresAt: number
}

export declare type OAuthSession = BaseSession & {
  authType: 'oauth',
  accessToken: string,
  refreshToken: string
}

export declare type DMSession = BaseSession & {
  authType: 'dm'
}

export declare type AuthSession = OAuthSession | DMSession

export declare type Session = AuthSession & Partial<{
  
}>