export type SignOptions = {
  algorithm: string;
  header: Header;
  encoding: BufferEncoding;
  noTimestamp: boolean;
  expiresIn: number | string;
  notBefore: number | string;
};

export type VerifyOptions = {
  audience: string | string[];
  issuer: string | string[];
  subject: string;
  jwtid: string;
  clockTimestamp: number;
  nonce: number;
  ignoreNotBefore: boolean;
  clockTolerance: number;
  ignoreExpiration: number;
  maxAge: number | string;
  complete: boolean;
  algorithm: string;
};

export type Payload = {
  iss: string;
  nonce: number;
  exp: number;
  iat?: number;
  nbf?: number;
  sub?: string;
  jti?: string;
  aud?: string | string[];
};

export type Header = {
  alg: string;
};

export type Token = {
  header: Header;
  payload: Payload;
  signature: string;
};

export type TokenOrPayload = Partial<{
  header: Header;
  payload: Payload;
  signature: string;
  iss: string;
  nonce: number;
  exp: number;
  iat: number;
  nbf: number;
  sub: string;
  jti: string;
  aud: string | string[];
}>;

export type DecodeOptions = {
  encoding: BufferEncoding;
  complete: boolean;
};

export interface Signer {
  (payload: string): Promise<string> | string;
}

export interface Verifier {
  (payload: string, signature: string, address: string): boolean | string;
}
