import type { Verifier } from "../types";
import { JwaVerifyError } from "../errors";


export function jwaVerify(
	verifier: Verifier,
  payload: string,
  signature: string,
  address: string
): boolean {


  const result = verifier(payload, signature, address);
  switch(typeof result){
    case "boolean" : {
      return result as boolean;
    };
    case "string": {
      return result === address;
    };
    default: throw new JwaVerifyError("verifier() does not return boolean or string", result);
  }
}
