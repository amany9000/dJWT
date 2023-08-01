
import { Buffer } from "buffer";
import {toString} from  "./toString";
import * as util from "util";
import {signPayload} from "jwa";

function base64url(string: string, encoding: BufferEncoding) {
  return Buffer.from(string, encoding)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function jwsSecuredInput(header, payload, encoding) {
  encoding = encoding || "utf8";
  var encodedHeader = base64url(toString(header), "binary");
  var encodedPayload = base64url(toString(payload), encoding);
  return util.format("%s.%s", encodedHeader, encodedPayload);
}

export function signJws(opts) {
  var header = opts.header;
  var payload = opts.payload;
  var encoding = opts.encoding;
  var keyStore = opts.keyStore;
  var securedInput = jwsSecuredInput(header, payload, encoding);
  var signature = signPayload(securedInput, keyStore);
  return util.format("%s.%s", securedInput, signature);
}
