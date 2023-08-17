import type { Verifier } from "../types";

export async function jwaVerify(
  verifier: Verifier,
  payload: string,
  signature: string,
  address?: string
): Promise<boolean> {
  if (!address)
    return (await verifier(payload, signature, address)) as boolean;
  else {
    const addressRecovered = await verifier(payload, signature);
    return addressRecovered === address;
  }
}
