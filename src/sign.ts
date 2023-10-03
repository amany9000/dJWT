import { timespan } from "./utils";
import { signJws } from "./jws";
import { payloadSchema, signOptionsSchema } from "./schemas";
import { InvalidPayloadError, InvalidSignOptionsError } from "./errors";

import type { SignOptions, Payload, Header, Signer } from "./types";

export async function sign(
  payload: Payload,
  signer: Signer,
  options: Partial<SignOptions> & Pick<SignOptions, "algorithm">
) {
  const payloadParseResult = payloadSchema.safeParse(payload);
  if(!payloadParseResult.success){
    throw new InvalidPayloadError(payloadParseResult.error.message);
  }

  const optionsParseResult = signOptionsSchema.safeParse(options);
  if(!optionsParseResult.success){
    throw new InvalidSignOptionsError(optionsParseResult.error.message);
  }


  let header: Header | undefined = options.header;

  if (!header) {
    if (!options.algorithm)
      throw new InvalidSignOptionsError(
        "Either header or algorithm is required in options"
      );

    header = {
      alg: options.algorithm,
    };
  }

  const timestamp = payload.iat || Math.floor(Date.now() / 1000);

  if (options.noTimestamp) {
    delete payload.iat;
  } else {
    payload.iat = timestamp;
  }

  if (options.expiresIn !== undefined) {
    if (payload.exp !== undefined)
      throw new InvalidSignOptionsError(
        'Bad "options.expiresIn" option the payload already has an "exp" property.'
      );
    else payload.exp = timespan(options.expiresIn, timestamp);
  }

  if (options.notBefore !== undefined) {
    if (payload.nbf !== undefined) {
      throw new InvalidSignOptionsError(
        'Bad "options.notBefore" option the payload already has an "nbf" property.'
      );
    } else payload.nbf = timespan(options.notBefore, timestamp);
  }

  const encoding = options.encoding || "utf8";

  let signature = signJws(header, payload, signer, encoding as BufferEncoding);
  return signature;
}
