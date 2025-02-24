import { decodeJws } from "./jws";
import { TokenOrPayload, DecodeOptions } from "./types";
import { VerificationError } from "./errors";
import { decodeOptionsSchema } from "./schemas";

export function decode(
  jwtString: string,
  options?: Partial<DecodeOptions>
): TokenOrPayload {
  options = Object.assign({}, options);
  
  const optionsParseResult = decodeOptionsSchema.safeParse(options);
  if (!optionsParseResult.success) {
    throw new VerificationError(
      JSON.parse(optionsParseResult.error.message)[0].message
    );
  }
  
  const decoded = decodeJws(jwtString, options.sigEncoding);
  const payload = decoded.payload;
  if (options.complete)
    return {
      header: decoded.header,
      payload: payload,
      signature: decoded.signature,
    };
  else return payload;
}
