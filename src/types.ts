
export type SignerOptions = {
    expiresIn: number;
    notBefore: number;
    audience: string;
    algorithm: string;
    header: object;
    encoding: string;
    issuer: string;
    subject: string;
    jwtid: string;
    noTimestamp: boolean;
    keyid: string;
    mutatePayload: boolean;
};

export type Payload = {
    iat?: number;
    nbf: number | string;
    exp: number | string;
};

export type Header = {
    alg: string;
    typ?: string;
    kid: string;
};

export type JwsVerifyOptions = {
    encoding: ((this: any, key: string, value: any) => any);
    json : boolean;
};