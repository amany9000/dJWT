import type { Verifier } from "../types";
import { JwaVerifyError } from "../errors";


export function jwaVerify(
	verifierID: number,
	verifier: Verifier,
  payload: string,
  signature: string,
  address: string
): boolean {

  switch(verifierID){
    case 0 : {
      return verifier(payload, signature, address) as boolean;
    };
    case 1: {
			const addressRecovered : string = verifier(payload, signature) as string;
      return addressRecovered === address;
    };
    default: throw new JwaVerifyError("Incorrect Verifier function ID, can be only 0 or 1.", verifierID)
  }
}
