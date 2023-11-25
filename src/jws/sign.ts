import { Buffer } from "buffer";
import { toString } from "./toString";
import { signPayload } from "../jwa";
import type { Payload, Header, Signer } from "../types";

function base64url(string: string, encoding: BufferEncoding): string{
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
): string {
  encoding = encoding || "utf8";
  let encodedHeader = base64url(toString(header), "binary");
  let encodedPayload = base64url(toString(payload), encoding);
  return `${encodedHeader}.${encodedPayload}`;
}

export async function signJws(
  header: Header,
  payload: Payload,
  signer: Signer,
  encoding: BufferEncoding
): Promise<string> {
  let securedInput = jwsSecuredInput(header, payload, encoding);
  let signature = await signPayload(securedInput, signer);
  return `${securedInput}.${base64url(signature, encoding)}`
}
