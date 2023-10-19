import { u8aToHex } from "@polkadot/util";
import {
  decodeAddress,
  signatureVerify
} from "@polkadot/util-crypto";

export const validateSigPolkadot = (payload: string, signature: string, address: string) : boolean => {
  const publicKey = decodeAddress(address);
  const hexPublicKey = u8aToHex(publicKey);

  return signatureVerify(payload, signature, hexPublicKey).isValid;
};

