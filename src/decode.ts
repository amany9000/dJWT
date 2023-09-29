import {decodeJws} from "./jws";
import {TokenOrPayload, JwsDecodeOptions} from "./types";

export function decode(jwt: string, opts?: Partial<JwsDecodeOptions>): TokenOrPayload | null{
  opts = Object.assign({}, opts);

  const decoded = decodeJws(jwt, opts.encoding);
  if (!decoded)
    return null;

  const payload = decoded.payload;
  if (opts.complete)
    return {
      header: decoded.header,
      payload: payload,
      signature: decoded.signature
    };
  else
    return payload;
};
