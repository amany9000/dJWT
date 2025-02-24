import { Buffer } from "buffer";
import { toString } from "./toString";
import { signPayload } from "../jwa";
import type { Payload, Header, Signer } from "../types";
import { isHexString } from "../utils/isHexString";
import { JwsEncodingError } from "../errors/jws"

function base64url(string: & string, encoding: BufferEncoding): string {

  if (encoding === 'hex') {
    let { str, isHex } = isHexString(string);
    if (!isHex)
      throw new JwsEncodingError('Non-Hexstring provided with hex encoding', string);
    string = str;
  }

  return Buffer.from(string, encoding)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function jwsSecuredInput(
  header: Header,
  payload: Payload,
): string {
  let encodedHeader = base64url(toString(header), 'utf-8');
  let encodedPayload = base64url(toString(payload), 'utf-8');
  return `${encodedHeader}.${encodedPayload}`;
}

export async function signJws(
  header: Header,
  payload: Payload,
  signer: Signer,
  sigEncoding: BufferEncoding
): Promise<string> {
  let securedInput = jwsSecuredInput(header, payload);
  let signature = await signPayload(securedInput, signer);
  return `${securedInput}.${base64url(signature, sigEncoding)}`
}
