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
  nonce: string;
  ignoreNotBefore: boolean;
  clockTolerance: number;
  ignoreExpiration: number;
  maxAge: number;
  complete: boolean;
  algorithms: [string];
};

export type Payload = {
  iat?: number;
  nbf?: number | string;
  exp: number | string;
  sub?: string;
  jti?: string;
  nonce?: string;
  aud?: string | [string];
  iss: string;
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

export type Verifier = 
  (payload: string, signature: string, address?: string) => Promise<boolean | string>;
