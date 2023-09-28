export type SignerOptions = {
  algorithm: string;
  header: Header;
  verifierID: number;
  encoding: string;
  noTimestamp: boolean;
  expiresIn: number | string;
  notBefore: number | string;
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
  exp: number;
  iat?: number;
  nbf?: number;
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