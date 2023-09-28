export type SignerOptions = {
  algorithm: string;
  header: Header;
  encoding: string;
  noTimestamp: boolean;
  verifierID: number = 0;
  expiresIn?: number;
  notBefore?: number;
};

export type VerifierOptions = {
  audience: string | [string];
  issuer: string;
  subject: string;
  jwtid: string;
  clockTimestamp: number;
  nonce: number;
  ignoreNotBefore: boolean;
  clockTolerance: number;
  ignoreExpiration: number;
  maxAge: number;
  complete: boolean;
  algorithms: [string];
};

export type Payload = {
  iss: string;
  nonce: number;
  exp: number | string;
  iat?: number;
  nbf?: number | string;
  sub?: string;
  jti?: string;
  aud?: string | [string];
};

export type Header = {
  alg: string;
  verifierID: number;
};

export type Token = {
  header?: Header;
  payload: Payload;
  signature: string;
};

export type JwsVerifyOptions = {
  encoding?: (this: any, key: string, value: any) => any;
};

interface Signer{
  (payload: string): Promise<string> | string;
}

interface Verifier{
  (payload: string, signature: string, address: string): boolean;
  (payload: string, signature: string): string;
}