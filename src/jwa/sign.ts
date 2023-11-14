import type { Signer } from "../types";

export async function signPayload(
  payload: string,
  signer: Signer
): Promise<string> {
  return await signer(payload);
}
