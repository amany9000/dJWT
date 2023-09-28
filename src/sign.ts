import { timespan } from "./utils";
import { signJws } from "./jws";
import { payloadSchema } from "./schemas";
import { InvalidPayloadError, InvalidOptionsError } from "./errors";

import type { SignerOptions, Payload, Header, Signer } from "./types";

// TODO, add zod.
/*
function validateOptions(options) {
  return validate(sign_options_schema, false, options, 'options');
}
*/

export async function sign(
  payload: Payload,
  signer: Signer,
  options?: Partial<SignerOptions>
) {
  options = options || {};

  payloadSchema.parse(payload);

  if (!options.verifierID) options.verifierID = 0;
  else if (options.verifierID < 0 || options.verifierID > 1)
    throw new InvalidOptionsError("Verifier ID out of range: 0:2");

  if (!options.algorithm)
    throw new InvalidOptionsError("algorithm is required in options");


  const header: Header = Object.assign({
    alg: options.algorithm,
    verifierID: options.verifierID,
  });
  // @TODO
  //validateOptions(options);

  const timestamp = payload.iat || Math.floor(Date.now() / 1000);

  if (options.noTimestamp) {
    delete payload.iat;
  } else {
    payload.iat = timestamp;
  }

  if (options.expiresIn !== undefined){
    if(payload.exp !== undefined)
      throw new InvalidPayloadError('Bad "options.expiresIn" option the payload already has an "exp" property.');
    else
      payload.exp = timespan(options.expiresIn, timestamp);
  }

  if (options.notBefore !== undefined){
    if(payload.nbf !== undefined){
      throw new InvalidPayloadError('Bad "options.notBefore" option the payload already has an "nbf" property.');
    }
    else
      payload.nbf = timespan(options.notBefore, timestamp);
  }

  const encoding = options.encoding || "utf8";

  let signature = signJws(header, payload, signer, encoding as BufferEncoding);
  return signature;
}
