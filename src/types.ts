export type SignOptions = {
  algorithm: string;
  header: Header;
  sigEncoding: BufferEncoding;
  noTimestamp: boolean;
  expiresIn: number | string;
  notBefore: number | string;
};

export type DecodeOptions = {
  sigEncoding: BufferEncoding;
  complete: boolean;
};

export type VerifyOptions =  DecodeOptions & {
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

export type TokenOrPayload = Partial<Token & Payload>;

export interface Signer {
  (payload: string): Promise<string> | string;
}

export interface Verifier {
  (payload: string, signature: string, address: string):
    Promise<boolean | string>
    | boolean
    | string;
}
