import { z } from "zod";

import { decode } from "./decode";
import { timespan } from "./utils";
import { jwsVerify } from "./jws";
import {
  VerificationError,
  InvalidPayloadError,
  TokenExpiredError,
  NotBeforeError,
  OptionsVerificationError,
} from "./errors";
import { verifyOptionsSchema, headerSchema, payloadSchema } from "./schemas";

import type { VerifyOptions, Verifier, TokenOrPayload } from "./types";

export async function verify(
  jwtString: string,
  verifier: Verifier,
  options?: Partial<VerifyOptions>
): Promise<TokenOrPayload> {
  //clone this object since we are going to mutate it.
  options = Object.assign({}, options);

  const optionsParseResult = verifyOptionsSchema.safeParse(options);
  if (!optionsParseResult.success) {
    throw new VerificationError(
      JSON.parse(optionsParseResult.error.message)[0].message
    );
  }

  jwtString = z
    .string({
      invalid_type_error: "jwtString must be provided",
    })
    .min(1, "jwtString must be non-empty")
    .parse(jwtString);

  if (jwtString.split(".").length !== 3) {
    throw new VerificationError("jwt malformed");
  }

  const clockTimestamp =
    options.clockTimestamp || Math.floor(Date.now() / 1000);

  const decodedToken = decode(jwtString, {
    complete: true,
    sigEncoding: options.sigEncoding
  });

  if (!decodedToken) {
    throw new VerificationError("Invalid token");
  }

  if (!decodedToken.header) {
    throw new VerificationError(
      "Invalid token decoding, header not present in decoded token"
    );
  }

  if (!decodedToken.payload) {
    throw new VerificationError(
      "Invalid token decoding, payload not present in decoded token"
    );
  }

  if (!decodedToken.signature) {
    throw new VerificationError(
      "Invalid token decoding, signature not present in decoded token"
    );
  }

  const header = decodedToken.header;
  const headerParseResult = headerSchema.safeParse(header);
  if (!headerParseResult.success) {
    throw new VerificationError(
      JSON.parse(headerParseResult.error.message)[0].message
    );
  }

  const payload = decodedToken.payload;
  const payloadParseResult = payloadSchema.safeParse(payload);
  if (!payloadParseResult.success) {
    throw new InvalidPayloadError(
      JSON.parse(payloadParseResult.error.message)[0].message
    );
  }

  if (options.algorithm) {
    if (options.algorithm !== header.alg)
      throw new OptionsVerificationError(
        "Header.alg is incorrect.",
        header.alg,
        options.algorithm
      );
  }

  if (payload.nbf !== undefined && !options.ignoreNotBefore) {
    if (payload.nbf > clockTimestamp + (options.clockTolerance || 0)) {
      throw new NotBeforeError("jwt not active", payload.nbf);
    }
  }

  if (payload.exp !== undefined && !options.ignoreExpiration) {
    if (clockTimestamp >= payload.exp + (options.clockTolerance || 0)) {
      throw new TokenExpiredError("jwt expired", payload.exp);
    }
  }

  if (options.audience) {
    if (payload.aud === undefined)
      throw new VerificationError(
        "options.audience is present but payload.aud is not"
      );

    const audiences = Array.isArray(options.audience)
      ? options.audience
      : [options.audience];
    const target = Array.isArray(payload.aud) ? payload.aud : [payload.aud];

    const match = target.some(function (targetAudience) {
      return audiences.some(function (audience: any) {
        return audience instanceof RegExp
          ? audience.test(targetAudience)
          : audience === targetAudience;
      });
    });

    if (!match) {
      throw new OptionsVerificationError(
        "JWT audience is incorrect.",
        target.join(" or "),
        audiences.join(" or ")
      );
    }
  }

  if (options.issuer) {
    const invalid_issuer =
      payload.iss !== options.issuer ||
      (Array.isArray(options.issuer) &&
        options.issuer.indexOf(payload.iss) === -1);

    if (invalid_issuer) {
      throw new OptionsVerificationError(
        "JWT issuer invalid.",
        payload.iss,
        Array.isArray(options.issuer)
          ? options.issuer.join(" or ")
          : options.issuer
      );
    }
  }

  if (options.subject) {
    if (payload.sub !== options.subject) {
      throw new OptionsVerificationError(
        "JWT subject invalid.",
        payload.sub ? payload.sub : "undefined",
        options.subject
      );
    }
  }

  if (options.jwtid) {
    if (payload.jti !== options.jwtid) {
      throw new OptionsVerificationError(
        "JWT ID invalid.",
        payload.jti ? payload.jti : "undefined",
        options.jwtid
      );
    }
  }

  if (options.nonce) {
    if (payload.nonce !== options.nonce) {
      throw new OptionsVerificationError(
        "Signature nonce invalid.",
        payload.nonce,
        options.nonce
      );
    }
  }

  if (options.maxAge) {
    if (typeof payload.iat !== "number") {
      throw new VerificationError("iat required when maxAge is specified");
    }

    const maxAgeTimestamp = timespan(options.maxAge, payload.iat);
    if (maxAgeTimestamp === undefined) {
      throw new VerificationError(
        '"maxAge" should be a number of seconds or string representing a timespan eg: "1d", "20h", 60'
      );
    }
    if (clockTimestamp >= maxAgeTimestamp + (options.clockTolerance || 0)) {
      throw new TokenExpiredError("maxAge exceeded", maxAgeTimestamp);
    }
  }

  const valid = await jwsVerify(verifier, jwtString, decodedToken.payload.iss, options.sigEncoding);

  if (!valid) {
    throw new VerificationError("Invalid signature");
  }

  const signature = decodedToken.signature;
  if (options.complete)
    return {
      header: header,
      payload: payload,
      signature: signature,
    };
  else return payload;
}
