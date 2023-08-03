
import { Buffer } from "buffer";
import {toString} from  "./toString";
import * as util from "util";
import {signPayload} from "./jwa";
import type {Payload, Header} from "../types"

function base64url(string: string, encoding: BufferEncoding) {
  return Buffer.from(string, encoding)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function jwsSecuredInput(header : object, payload : object, encoding: BufferEncoding) {
  encoding = encoding || "utf8";
  var encodedHeader = base64url(toString(header), "binary");
  var encodedPayload = base64url(toString(payload), encoding);
  return util.format("%s.%s", encodedHeader, encodedPayload);
}

export function signJws(header: Header, payload: Payload, encoding: BufferEncoding) {
  var securedInput = jwsSecuredInput(header, payload, encoding);
  var signature = signPayload(securedInput);
  return util.format("%s.%s", securedInput, signature);
}
