import {
  web3Sign,
  signEthers,
  signPolkadot,
  signBitcoin,
  metamaskSign,
} from "../sharedFixtures";
import { signJWT } from "../../src";
import { expect, describe, it } from "@jest/globals";

import type { Payload, Signer, SignOptions } from "../../src";

describe("Test for signing: sign()", () => {
  it.each([
    [web3Sign, "0x231a5147b7c2bDF1dc8449Da0DeF741077447bCD", "ES256k"],
    [
      signPolkadot,
      "5F7MBfGdyTg5th5gzsWMUyaVBRUkhEZw5Q82rPrtSP1q9F3E",
      "SR25519",
    ],
    [metamaskSign, "0x29c76e6ad8f28bb1004902578fb108c507be341b", "ES256k"],
  ])(
    "sign with %p",
    async (signFunc: Signer, address: string, algorithm: string) => {
      const token = await signJWT(
        {
          nonce: 654321,
          iat: 1582062696,
          exp: 1782098690,
          iss: address,
        },
        signFunc,
        { algorithm }
      );

      expect(token).not.toBe(void 0);
      expect(typeof token).toBe("string");
      expect(token.split(".").length).toBe(3);
    }
  );

  it.each([
    [signEthers, "0x145831eba8085d78c1d30A9C108aAD8A1501d6e0", "ES256k"],
    [
      signPolkadot,
      "5F7MBfGdyTg5th5gzsWMUyaVBRUkhEZw5Q82rPrtSP1q9F3E",
      "SR25519",
    ],
    [signBitcoin, "1HZwtseQ9YoRteyAxzt6Zq43u3Re5JKPbk", "ES256k", false],
  ])(
    "sign with %p with header in options instead of algorithm",
    async (signFunc: Signer, address: string, algorithm: string, isHexSig: boolean = true) => {

      const payload: Payload = {
        nonce: 654321,
        iat: 1582062696,
        exp: 1782098690,
        iss: address,
      }
      const signOptions: Partial<SignOptions> &
        (Pick<SignOptions, "header"> | Pick<SignOptions, "algorithm">) = { header: { alg: algorithm } }

      if (!isHexSig)
        signOptions.sigEncoding = "utf8";

      const token = await signJWT(
        payload,
        signFunc,
        signOptions
      );

      expect(token).not.toBe(void 0);
      expect(typeof token).toBe("string");
      expect(token.split(".").length).toBe(3);
    }
  );
});
