import type { Verifier } from "../types";
import { JwaVerifyError, JwaAddressIncorrectError } from "../errors";

export async function jwaVerify(
  verifier: Verifier,
  payload: string,
  signature: string,
  address: string
): Promise<boolean> {
  const result = await verifier(payload, signature, address);
  switch (typeof result) {
    case "boolean": {
      return result as boolean;
    }
    case "string": {
      if (result === address) return true;
      else throw new JwaAddressIncorrectError(address, result);
    }
    default:
      throw new JwaVerifyError(
        "verifier() does not return boolean or string",
        result
      );
  }
}
