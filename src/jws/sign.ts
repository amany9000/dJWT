import { Buffer } from "buffer";
import { toString } from "./toString";
import * as util from "util";
import { signPayload } from "../jwa";
import type { Payload, Header, Signer } from "../types";

function base64url(string: string, encoding: BufferEncoding) {
  return Buffer.from(string, encoding)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function jwsSecuredInput(
  header: object,
  payload: object,
  encoding: BufferEncoding
) {
  encoding = encoding || "utf8";
  let encodedHeader = base64url(toString(header), "binary");
  let encodedPayload = base64url(toString(payload), encoding);
  return util.format("%s.%s", encodedHeader, encodedPayload);
}

export async function signJws(
  header: Header,
  payload: Payload,
  signer: Signer,
  encoding: BufferEncoding
) {
  let securedInput = jwsSecuredInput(header, payload, encoding);
  let signature = await signPayload(securedInput, signer);
  return util.format("%s.%s", securedInput, base64url(signature, encoding));
}
