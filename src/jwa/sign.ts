import type { Signer } from "../types";

export async function signPayload(payload: string, signer: Signer) {
  return await signer(payload);
}
