import { Keyring } from "@polkadot/keyring";
import { stringToU8a, u8aToHex } from "@polkadot/util";

import {
  cryptoWaitReady,
	blake2AsHex
} from "@polkadot/util-crypto";

import { readFile} from "fs";


type KeyStore = {
  mnemonicEncrypted: string;
  encryptionNonce: string;
  keyPairs: string[] | null;
  encKeyPairs: string[] | null;
};

function getKeyStore() {
  return new Promise<KeyStore | undefined>((resolve, _) => {
    readFile("./test/sharedFixtures/polkadot.js/keystore.json", (err, keyStoreString) => {
        if(err){
					throw new Error("Keystore file not found")
				}
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



//Address:  5F7MBfGdyTg5th5gzsWMUyaVBRUkhEZw5Q82rPrtSP1q9F3E
export async function signPolkadot(payload: string): Promise<`0x${string}`> {
  await cryptoWaitReady();

  const keypairString = await getKeyPairById(0);

  if (keypairString === undefined) {
    throw new Error("Keypair of given ID not present");
  }

  return new Promise<`0x${string}`>((resolve, _) => {
    const keyring = new Keyring({ type: "sr25519" });
    const keypair = keyring.addFromJson(JSON.parse(keypairString));

		//Password for keystore
		const hash = blake2AsHex("1234").slice(34);
    
		keypair.unlock(hash);

    const signature = keypair.sign(stringToU8a(payload));
    resolve(u8aToHex(signature));
  });
}

