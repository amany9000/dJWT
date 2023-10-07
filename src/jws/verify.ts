import { Buffer } from "buffer";
import { jwaVerify } from "../jwa";
import { JwsDecodingError } from "../errors";

import type { Token, Verifier, Header, Payload } from "../types";

const JWS_REGEX = /^[a-zA-Z0-9\-_]+?\.[a-zA-Z0-9\-_]+?\.([a-zA-Z0-9\-_]+)?$/;

function isObject(thing: any) {
  return Object.prototype.toString.call(thing) === "[object Object]";
}

function safeJsonParse(thing: any) {
  if (isObject(thing)) return thing;
  try {
    return JSON.parse(thing);
  } catch (e) {
    return undefined;
  }
}

function headerFromJWS(jwsSig: string): Header {
  let encodedHeader = jwsSig.split(".", 1)[0];

  if (encodedHeader)
    return safeJsonParse(
      Buffer.from(encodedHeader, "base64").toString("binary")
    );
  else throw new JwsDecodingError("Error decoding jws from this jwt", jwsSig);
}

function securedInputFromJWS(jwsSig: string) {
  return jwsSig.split(".", 2).join(".");
}

function signatureFromJWS(jwsSig: string, encoding?: BufferEncoding) {
  encoding = encoding || "utf8";
  const sig = jwsSig.split(".")[2];

  if (sig) return Buffer.from(sig, "base64").toString(encoding);
  throw new JwsDecodingError("Signature not present in token", jwsSig);
}

function payloadFromJWS(jwsSig: string, encoding?: BufferEncoding) {
  encoding = encoding || "utf8";
  let payload = jwsSig.split(".")[1];

  if (payload) return Buffer.from(payload, "base64").toString(encoding);
  else throw new JwsDecodingError("Error decoding jws", jwsSig);
}

export function isValidJws(string: string) {
  return JWS_REGEX.test(string) && !!headerFromJWS(string);
}

export function jwsVerify(verifier: Verifier, jwsSig: string, address: string) {
  let signature = signatureFromJWS(jwsSig);
  let securedInput = securedInputFromJWS(jwsSig);
  return jwaVerify(verifier, securedInput, signature, address);
}

export function decodeJws(
  jwsSig: string,
  encoding: BufferEncoding = "utf8"
): Token {
  if (!isValidJws(jwsSig))
    throw new JwsDecodingError("JWT doesn't pass regex", jwsSig);

  let header = headerFromJWS(jwsSig);
  if (!header) throw new JwsDecodingError("JWT doesn't contain header", jwsSig);

  let payload = JSON.parse(payloadFromJWS(jwsSig)) as Payload;
  return {
    header: header,
    payload: payload,
    signature: signatureFromJWS(jwsSig, encoding),
  };
}
