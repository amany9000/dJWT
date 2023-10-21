import { Keyring } from "@polkadot/keyring";
import { stringToU8a, u8aToHex } from "@polkadot/util";
import {
  blake2AsHex,
  cryptoWaitReady
} from "@polkadot/util-crypto";
import { readFile} from "fs";


type KeyStore = {
  mnemonicEncrypted: string;
  encryptionNonce: string;
  keyPairs: string[] | null;
  encKeyPairs: string[] | null;
};

function getKeyStore() {
  return new Promise<KeyStore | undefined>((resolve, reject) => {
    readFile("polkadot.js/keystore.json", (err, keyStoreString) => {
        if(err)
            resolve(undefined);
        if(keyStoreString)
            resolve(JSON.parse(keyStoreString.toString()));
    });
  });
}

async function getKeyPairById(id: number) {
  const keyStore = await getKeyStore();

  if (keyStore && keyStore.keyPairs) return keyStore.keyPairs[id];

  return undefined;
}

export async function signPayload(payload: string | Uint8Array) {
  await cryptoWaitReady();
  
  const hash = blake2AsHex("1234").slice(34);  

  const keyPairID = 0

  const keypairString = await getKeyPairById(keyPairID);

  if (keypairString === undefined) {
    throw new Error("Keypair of given ID not present");
  }

  return new Promise<`0x${string}`>((resolve, reject) => {
    const keyring = new Keyring({ type: "sr25519" });
    const keypair = keyring.addFromJson(JSON.parse(keypairString));
    keypair.unlock(hash);

    let signature;
    if (typeof(payload) === "string")
      signature = keypair.sign(stringToU8a(payload));
    else
      signature = keypair.sign(payload);

    const hex = u8aToHex(signature);
    resolve(hex);
  });
}
