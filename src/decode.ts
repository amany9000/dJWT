import { decodeJws } from "./jws";
import { TokenOrPayload, DecodeOptions } from "./types";

export function decode(
  jwtString: string,
  options?: Partial<DecodeOptions>
): TokenOrPayload {
  options = Object.assign({}, options);
  const decoded = decodeJws(jwtString, options.encoding);

  const payload = decoded.payload;
  if (options.complete)
    return {
      header: decoded.header,
      payload: payload,
      signature: decoded.signature,
    };
  else return payload;
}
