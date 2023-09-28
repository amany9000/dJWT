import { timespan } from "./utils";
import { signJws } from "./jws";
import { payloadSchema, signerOptionsSchema } from "./schemas";
import { InvalidPayloadError, InvalidOptionsError } from "./errors";

import type { SignerOptions, Payload, Header, Signer } from "./types";

export async function sign(
  payload: Payload,
  signer: Signer,
  options: Partial<SignerOptions> & Pick<SignerOptions, "algorithm">
) {
  options = options || { algorithm: "ES256k" };

  payloadSchema.parse(payload);
  signerOptionsSchema.parse(options);

  let header: Header | undefined = options.header;

  if (!header) {
    if (!options.verifierID) options.verifierID = 0;

    if (!options.algorithm)
      throw new InvalidOptionsError(
        "Either header or algorithm is required in options"
      );

    header = {
      alg: options.algorithm,
      verifierID: options.verifierID,
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
      throw new InvalidPayloadError(
        'Bad "options.expiresIn" option the payload already has an "exp" property.'
      );
    else payload.exp = timespan(options.expiresIn, timestamp);
  }

  if (options.notBefore !== undefined) {
    if (payload.nbf !== undefined) {
      throw new InvalidPayloadError(
        'Bad "options.notBefore" option the payload already has an "nbf" property.'
      );
    } else payload.nbf = timespan(options.notBefore, timestamp);
  }

  const encoding = options.encoding || "utf8";

  let signature = signJws(header, payload, signer, encoding as BufferEncoding);
  return signature;
}
