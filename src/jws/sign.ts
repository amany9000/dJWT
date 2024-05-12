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
      throw new JwsEncodingError('Non-Hexstring provided with hex encoding', string)
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
  payloadEncoding: BufferEncoding
): string {
  let encodedHeader = base64url(toString(header), 'binary');
  let encodedPayload = base64url(toString(payload), payloadEncoding);
  return `${encodedHeader}.${encodedPayload}`;
}

export async function signJws(
  header: Header,
  payload: Payload,
  signer: Signer,
  payloadEncoding: BufferEncoding,
  sigEncoding: BufferEncoding
): Promise<string> {
  let securedInput = jwsSecuredInput(header, payload, payloadEncoding);
  let signature = await signPayload(securedInput, signer);
  console.log("signer", signer, signature, sigEncoding);
  return `${securedInput}.${base64url(signature, sigEncoding)}`
}
