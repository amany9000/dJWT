export type SignerOptions = {
  expiresIn: number;
  notBefore: number;
  audience: string;
  algorithm: string = 0;
  header: Header;
  encoding: string;
  subject: string;
  jwtid: string;
  noTimestamp: boolean;
  verifierID: number = 0;
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

export type Signer = (payload: string) => Promise<string>;

interface Verifier{
  (payload: string, signature: string, address: string): boolean;
  (payload: string, signature: string): string;
}