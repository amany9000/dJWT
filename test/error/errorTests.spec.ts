import {
  web3Sign,
  signEthers,
  signPolkadot,
  signBitcoin,
  metamaskSign,
  verifyBitcoin,
  metamaskVerify,
} from "../sharedFixtures";
import { expect, describe, it } from "@jest/globals";

import type { Signer, Verifier, SignOptions } from "../../src";
import {
  sign,
  verify,
  InvalidSignOptionsError,
  OptionsVerificationError,
} from "../../src";

describe("Test for error: sign()", () => {
  it.each([
    [web3Sign, "0x231a5147b7c2bDF1dc8449Da0DeF741077447bCD", "ES256k"],
    [
      signPolkadot,
      "5F7MBfGdyTg5th5gzsWMUyaVBRUkhEZw5Q82rPrtSP1q9F3E",
      "SR25519",
    ],
  ])(
    "Fails due to expiresIn provided in signOption along with payload.exp, Signer: %p",
    async (signFunc: Signer, address: string, algorithm: string) => {
      expect(
        sign(
          {
            nonce: 654321,
            iat: 1582062696,
            exp: 1782098690,
            iss: address,
            nbf: 1682098690,
          },
          signFunc,
          { algorithm, notBefore: "1d" }
        )
      ).rejects.toThrow(InvalidSignOptionsError);
    }
  );

  it.each([
    [signEthers, "0x145831eba8085d78c1d30A9C108aAD8A1501d6e0", "ES256k"],
    [signBitcoin, "1HZwtseQ9YoRteyAxzt6Zq43u3Re5JKPbk", "ES256k"],
  ])(
    "Fails due to expiresIn provided in signOption along with payload.exp, Signer: %p",
    async (signFunc: Signer, address: string, algorithm: string) => {
      expect(
        sign(
          {
            nonce: 654321,
            iat: 1582062696,
            exp: 1782098690,
            iss: address,
          },
          signFunc,
          { algorithm, expiresIn: 12231132112 }
        )
      ).rejects.toThrow(InvalidSignOptionsError);
    }
  );
});

describe("Test errors for for verification: verify()", () => {
  it.each([
    [
      metamaskSign,
      metamaskVerify as Verifier,
      "0x29c76e6ad8f28bb1004902578fb108c507be341b",
      "ES256k",
    ],
    [
      signBitcoin,
      verifyBitcoin as Verifier,
      "1HZwtseQ9YoRteyAxzt6Zq43u3Re5JKPbk",
      "ES256k",
      false
    ],
  ])(
    "Verification fails because of incorrect options.algorithm, Signer: %p",
    async (
      signFunc: Signer,
      verifierFunc: Verifier,
      address: string,
      algorithm: string,
      isHexSig: boolean = true
    ) => {
      const payload = {
        nonce: 654321,
        iat: 1582062696,
        exp: 1782098690,
        iss: address,
      };

      const signOptions: Partial<SignOptions> &
      (Pick<SignOptions, "header"> | Pick<SignOptions, "algorithm">) = { header: { alg: algorithm } }

      if (!isHexSig)
        signOptions.sigEncoding = "utf8";

      const token = await sign(payload, signFunc, signOptions);
      expect(token).not.toBe(void 0);
      expect(typeof token).toBe("string");
      expect(token.split(".").length).toBe(3);

      expect(
        async () => await verify(token, verifierFunc, {
          complete: true,
          nonce: 654321,
          algorithm: "SR25519",
        })
      ).rejects.toThrow(OptionsVerificationError);
    }
  );
});
