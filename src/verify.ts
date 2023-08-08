import { decode } from "./decode";
import { timespan } from "./utils";
import { jwsVerify } from "./jws";
import { VerifierOptions, Token, Payload } from "./types";
import { VerificationError, TokenExpiredError, NotBeforeError } from "./errors";

export function verify(jwtString: string, options: VerifierOptions) {
  //clone this object since we are going to mutate it.
  options = Object.assign({}, options);

  if (options.clockTimestamp && typeof options.clockTimestamp !== "number") {
    throw new VerificationError("clockTimestamp must be a number");
  }

  if (
    options.nonce !== undefined &&
    (typeof options.nonce !== "string" || options.nonce.trim() === "")
  ) {
    throw new VerificationError("nonce must be a non-empty string");
  }

  const clockTimestamp =
    options.clockTimestamp || Math.floor(Date.now() / 1000);

  if (!jwtString) {
    throw new VerificationError("jwt must be provided");
  }

  if (typeof jwtString !== "string") {
    throw new VerificationError("jwt must be a string");
  }

  const parts = jwtString.split(".");

  if (parts.length !== 3) {
    throw new VerificationError("jwt malformed");
  }

  let decodedToken: Token | null;

  try {
    decodedToken = decode(jwtString, true);
  } catch (err) {
    throw err;
  }

  if (!decodedToken) {
    throw new VerificationError("invalid token");
  }

  const header = decodedToken.header;

  let valid;

  try {
    valid = jwsVerify(jwtString, decodedToken.header!.alg);
  } catch (e) {
    throw e;
  }

  if (!valid) {
    throw new VerificationError("invalid signature");
  }

  const payload = decodedToken.payload;

  if (typeof payload === "string")
    throw new VerificationError(
      "Error while decoding payload, it is of type string"
    );

  if (typeof payload.nbf !== "undefined" && !options.ignoreNotBefore) {
    if (typeof payload.nbf !== "number") {
      throw new VerificationError("invalid nbf value");
    }
    if (payload.nbf > clockTimestamp + (options.clockTolerance || 0)) {
      throw new NotBeforeError("jwt not active", payload.nbf);
    }
  }

  if (typeof payload.exp !== "undefined" && !options.ignoreExpiration) {
    if (typeof payload.exp !== "number") {
      throw new VerificationError("invalid exp value");
    }
    if (clockTimestamp >= payload.exp + (options.clockTolerance || 0)) {
      throw new TokenExpiredError("jwt expired", payload.exp);
    }
  }

  if (options.audience) {

    if(payload.aud === undefined)
      throw new VerificationError("options.audience is present but payload.aud is not");
    
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
      throw new VerificationError(
        "jwt audience invalid. expected: " + audiences.join(" or ")
      );
    }
  }

  if (options.issuer) {
    const invalid_issuer =
      (typeof options.issuer === "string" && payload.iss !== options.issuer) ||
      (Array.isArray(options.issuer) &&
        options.issuer.indexOf(payload.iss) === -1);

    if (invalid_issuer) {
      throw new VerificationError(
        "jwt issuer invalid. expected: " + options.issuer
      );
    }
  }

  if (options.subject) {
    if (payload.sub !== options.subject) {
      throw new VerificationError(
        "jwt subject invalid. expected: " + options.subject
      );
    }
  }

  if (options.jwtid) {
    if (payload.jti !== options.jwtid) {
      throw new VerificationError(
        "jwt jwtid invalid. expected: " + options.jwtid
      );
    }
  }

  if (options.nonce) {
    if (payload.nonce !== options.nonce) {
      throw new VerificationError(
        "jwt nonce invalid. expected: " + options.nonce
      );
    }
  }

  if (options.maxAge) {
    if (typeof payload.iat !== "number") {
      throw new VerificationError("iat required when maxAge is specified");
    }

    const maxAgeTimestamp = timespan(options.maxAge, payload.iat);
    if (typeof maxAgeTimestamp === "undefined") {
      throw new VerificationError(
        '"maxAge" should be a number of seconds or string representing a timespan eg: "1d", "20h", 60'
      );
    }
    if (clockTimestamp >= maxAgeTimestamp + (options.clockTolerance || 0)) {
      throw new TokenExpiredError("maxAge exceeded", maxAgeTimestamp);
    }
  }
  const signature = decodedToken.signature;
  if (options.complete === true)
    return {
      header: header,
      payload: payload,
      signature: signature,
    } as Token;
  else
    return {
      payload: payload,
      signature: signature,
    } as Token;
}
