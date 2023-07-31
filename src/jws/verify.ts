
import { Buffer } from "buffer";
import {toString} from  "./toString";
import {verifySignature} from "jwa";
import type {JwsVerifyOptions} from "../types"

const JWS_REGEX = /^[a-zA-Z0-9\-_]+?\.[a-zA-Z0-9\-_]+?\.([a-zA-Z0-9\-_]+)?$/;

function isObject(thing) {
  return Object.prototype.toString.call(thing) === "[object Object]";
}

function safeJsonParse(thing) {
  if (isObject(thing)) return thing;
  try {
    return JSON.parse(thing);
  } catch (e) {
    return undefined;
  }
}

function headerFromJWS(jwsSig) {
  var encodedHeader = jwsSig.split(".", 1)[0];
  return safeJsonParse(Buffer.from(encodedHeader, "base64").toString("binary"));
}

function securedInputFromJWS(jwsSig) {
  return jwsSig.split(".", 2).join(".");
}

function signatureFromJWS(jwsSig) {
  return jwsSig.split(".")[2];
}

function signatureObjectFromJws(jwsSig: string, encoding?: BufferEncoding) {
  encoding = encoding || "utf8";
  var payload = jwsSig.split(".")[2];
  return safeJsonParse(Buffer.from(payload, "base64").toString(encoding));
}

function payloadFromJWS(jwsSig : string, encoding? : BufferEncoding) {
  encoding = encoding || "utf8";
  var payload = jwsSig.split(".")[1];
  return Buffer.from(payload, "base64").toString(encoding);
}

export function isValidJws(string) {
  return JWS_REGEX.test(string) && !!headerFromJWS(string);
}

export function verifyJws(jwsSig, interfaceLib) {

  var jwsSigObj = decodeJws(jwsSig);
  //console.log("jwsSigobj", jwsSigObj)

  jwsSig = toString(jwsSig);
  var signature = signatureObjectFromJws(jwsSig);
  var securedInput = securedInputFromJWS(jwsSig);
  
  return verifySignature(securedInput, signature, interfaceLib);
}

export function decodeJws(jwsSig, opts: JwsVerifyOptions = {"json" : false, "encoding" : () => {}}) {
  //opts = opts || {};
  jwsSig = toString(jwsSig);

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