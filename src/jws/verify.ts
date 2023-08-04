
import { Buffer } from "buffer";
import { jwaVerify } from "jwa";
import {JwsDecodingError, JwsVerifyError} from "../errors";

import type {JwsVerifyOptions} from "../types"

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

  if(encodedHeader)
    return safeJsonParse(Buffer.from(encodedHeader, "base64").toString("binary"));
  else
    throw new JwsDecodingError("Error decoding jws from this jwt", encodedHeader)
}

function securedInputFromJWS(jwsSig: string) {
  return jwsSig.split(".", 2).join(".");
}

function signatureFromJWS(jwsSig: string) {
  return jwsSig.split(".")[2];
}

function signatureObjectFromJws(jwsSig: string, encoding?: BufferEncoding) {
  encoding = encoding || "utf8";
  var payload = jwsSig.split(".")[2];
  if(payload)
    return safeJsonParse(Buffer.from(payload, "base64").toString(encoding));
  else
    throw new JwsDecodingError("Error decoding jws", jwsSig)
}

function payloadFromJWS(jwsSig : string, encoding? : BufferEncoding) {
  encoding = encoding || "utf8";
  var payload = jwsSig.split(".")[1];
  if(payload)
    return Buffer.from(payload, "base64").toString(encoding);
  else
    throw new JwsDecodingError("Error decoding jws", jwsSig)
}

export function isValidJws(string: string) {
  return JWS_REGEX.test(string) && !!headerFromJWS(string);
}

function jwsVerify(jwsSig: string, algorithm: string) {
  if (!algorithm) {
    throw new JwsVerifyError("Missing algorithm parameter for jws.verify");
  }
  var signature = signatureFromJWS(jwsSig);
  var securedInput = securedInputFromJWS(jwsSig);
  return jwaVerify(securedInput, signature, algorithm);
}

export function decodeJws(jwsSig: string, opts: JwsVerifyOptions = {"json" : false, "encoding" : () => {}}) {
  //opts = opts || {};

  if (!isValidJws(jwsSig))
    return null;

  var header = headerFromJWS(jwsSig);

  if (!header)
    return null;

  var payload = payloadFromJWS(jwsSig);
  if (header.typ === 'JWT' || opts.json)
    payload = JSON.parse(payload, opts.encoding);

  return {
    header: header,
    payload: payload,
    signature: signatureFromJWS(jwsSig)
  };
}