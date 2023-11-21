import { u8aToHex } from "@polkadot/util";
import {
  decodeAddress,
  signatureVerify,
  cryptoWaitReady
} from "@polkadot/util-crypto";

export const validateSigPolkadot = async (payload: string, signature: string, address: string) : Promise<boolean> => {
  // unnecessary, added here just to test an async Verifier
  await cryptoWaitReady();

  const publicKey = decodeAddress(address);
  const hexPublicKey = u8aToHex(publicKey);

  return signatureVerify(payload, signature, hexPublicKey).isValid;
};

