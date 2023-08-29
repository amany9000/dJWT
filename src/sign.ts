import { timespan } from "./utils";
import { signJws } from "./jws";
import type { SignerOptions, Payload, Header, Signer } from "./types";

/*
Algo Names based on 
https://www.iana.org/assignments/jose/jose.xhtml#web-signature-encryption-algorithms
*/
const SUPPORTED_ALGS = ["ES256K", "ED25519", "SR25519"];

// TODO, add zod.
/*
function validateOptions(options) {
  return validate(sign_options_schema, false, options, 'options');
}

function validatePayload(payload) {
  return validate(registered_claims_schema, true, payload, 'payload');
}
*/

const options_to_payload = {
  audience: "aud",
  subject: "sub",
  jwtid: "jti",
};

const options_for_objects = [
  "expiresIn",
  "notBefore",
  "noTimestamp",
  "audience",
  "issuer",
  "subject",
  "jwtid",
];

export async function sign(payload: Payload, signer : Signer, issuerAddress: string, options?: Partial<SignerOptions>) {
  options = options || {};
  const isObjectPayload =
    typeof payload === "object" && !Buffer.isBuffer(payload);
  
  if(!options.verifierID)
    options.verifierID = 0;
  
  else if(options.verifierID <0 || options.verifierID > 1)
    throw new Error("Verifier ID out of range: 0:2");
  
  const header: Header = Object.assign({
    alg: options.algorithm ? options.algorithm : "ECS256K1",
    verifierID: options.verifierID,
  });

  function failure(err: unknown) {
    throw err;
  }

  if (typeof payload === "undefined") {
    return failure(new Error("payload is required"));
  } else if (isObjectPayload) {
    try {
      //validatePayload(payload);
    } catch (error) {
      return failure(error);
    }
    payload = Object.assign({}, payload);
  } 
  else {
    const invalid_options = options_for_objects.filter(function (opt) {
      return (
        options !== undefined && options[opt as keyof object] !== undefined
      );
    });

    if (invalid_options.length > 0) {
      return failure(
        new Error(
          "invalid " +
            invalid_options.join(",") +
            " option for " +
            typeof payload +
            " payload"
        )
      );
    }
  }

  if (
    typeof payload.exp !== "undefined" &&
    typeof options.expiresIn !== "undefined"
  ) {
    return failure(
      new Error(
        'Bad "options.expiresIn" option the payload already has an "exp" property.'
      )
    );
  }

  if (
    typeof payload.nbf !== "undefined" &&
    typeof options.notBefore !== "undefined"
  ) {
    return failure(
      new Error(
        'Bad "options.notBefore" option the payload already has an "nbf" property.'
      )
    );
  }

  try {
    //validateOptions(options);
  } catch (error) {
    return failure(error);
  }

  const timestamp = payload.iat || Math.floor(Date.now() / 1000);

  if (options.noTimestamp) {
    delete payload.iat;
  } else if (isObjectPayload) {
    payload.iat = timestamp;
  }

  if (typeof options.notBefore !== "undefined") {
    try {
      if (payload.nbf === undefined) {
        return failure(
          new Error(
            '"notBefore" should be a number of seconds or string representing a timespan eg: "1d", "20h", 60'
          )
        );
      }
      payload.nbf = timespan(options.notBefore, timestamp);
    } catch (err) {
      return failure(err);
    }
  }

  if (typeof options.expiresIn !== "undefined" && typeof payload === "object") {
    try {
      if (payload.exp === undefined) {
        return failure(
          new Error(
            '"expiresIn" should be a number of seconds or string representing a timespan eg: "1d", "20h", 60'
          )
        );
      }
      payload.exp = timespan(options.expiresIn, timestamp);
    } catch (err) {
      return failure(err);
    }
  }

  payload["iss"] = issuerAddress;

  Object.keys(options_to_payload).forEach(function (key) {
    const claim = options_to_payload[key as keyof object];
    if (options !== undefined && options[key as keyof object] !== undefined) {
      if (payload[claim] !== undefined) {
        return failure(
          new Error(
            'Bad "options.' +
              key +
              '" option. The payload already has an "' +
              claim +
              '" property.'
          )
        );
      }
      payload[claim as keyof object] = options[key as keyof object];
    }
  });

  const encoding = options.encoding || "utf8";

  let signature = signJws(header, payload, signer, encoding as BufferEncoding);
  return signature;
}
