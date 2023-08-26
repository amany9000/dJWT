import { Buffer } from "buffer";
import { jwaVerify } from "../jwa";
import { JwsDecodingError, JwsVerifyError } from "../errors";

import type { JwsVerifyOptions, Token, Verifier } from "../types";

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

function headerFromJWS(jwsSig: string) {
  var encodedHeader = jwsSig.split(".", 1)[0];

  if (encodedHeader)
    return safeJsonParse(
      Buffer.from(encodedHeader, "base64").toString("binary")
    );
  else
    throw new JwsDecodingError(
      "Error decoding jws from this jwt",
      encodedHeader
    );
}

function securedInputFromJWS(jwsSig: string) {
  return jwsSig.split(".", 2).join(".");
}

function signatureFromJWS(jwsSig: string) {
  const sig = jwsSig.split(".")[2];
  if (sig) return sig;

  throw new JwsDecodingError("Signature not present in token", jwsSig);
}


/*
function signatureObjectFromJws(jwsSig: string, encoding?: BufferEncoding) {
  encoding = encoding || "utf8";
  var payload = jwsSig.split(".")[2];
  if (payload)
    return safeJsonParse(Buffer.from(payload, "base64").toString(encoding));
  else throw new JwsDecodingError("Error decoding jws", jwsSig);
}
*/

function payloadFromJWS(jwsSig: string, encoding?: BufferEncoding) {
  encoding = encoding || "utf8";
  var payload = jwsSig.split(".")[1];
  if (payload) return Buffer.from(payload, "base64").toString(encoding);
  else throw new JwsDecodingError("Error decoding jws", jwsSig);
}

export function isValidJws(string: string) {
  return JWS_REGEX.test(string) && !!headerFromJWS(string);
}

export function jwsVerify( verifierID: number, verifier: Verifier, jwsSig: string, address: string) {
  var signature = signatureFromJWS(jwsSig);
  var securedInput = securedInputFromJWS(jwsSig);
  return jwaVerify(verifierID, verifier, securedInput, signature, address);
}

export function decodeJws(
  jwsSig: string,
  opts: JwsVerifyOptions = { encoding: undefined}
): Token | null {
  //opts = opts || {};

  if (!isValidJws(jwsSig)) return null;

  var header = headerFromJWS(jwsSig);
  if (!header) return null;

  var payload = JSON.parse(payloadFromJWS(jwsSig), opts.encoding);
  return {
    header: header,
    payload: payload,
    signature: signatureFromJWS(jwsSig),
  } as Token;
}
