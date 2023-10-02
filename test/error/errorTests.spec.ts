import {
    web3Sign,
    signEthers,
    signPolkadot,
    signBitcoin,
  } from "../sharedFixtures";import { expect, describe, it } from "@jest/globals";

import type { Signer } from "../../src";
import { sign, InvalidSignOptionsError, InvalidPayloadError } from "../../src";

describe("Test for error: sign()", () => {
  it.each([
    [web3Sign, "0x231a5147b7c2bDF1dc8449Da0DeF741077447bCD", 2, "ES256k"],
    [
      signPolkadot,
      "5F7MBfGdyTg5th5gzsWMUyaVBRUkhEZw5Q82rPrtSP1q9F3E",
      2,
      "SR25519",
    ],
  ])(
    "Fails due to incorrect verifierID in signOption with signer: %p",
    async (
      signFunc: Signer,
      address: string,
      verifierID: number,
      algorithm: string
    ) => {
      expect(
        sign(
          {
            nonce: 654321,
            iat: 1582062696,
            exp: 1782098690,
            iss: address,
          },
          signFunc,
          { verifierID, algorithm }
        )
      ).rejects.toThrow(InvalidSignOptionsError);
    }
  );

  it.each([
    [signEthers, "0x145831eba8085d78c1d30A9C108aAD8A1501d6e0", 1, "ES256k"],
    [signBitcoin, "1HZwtseQ9YoRteyAxzt6Zq43u3Re5JKPbk", undefined, "ES256k"],
  ])(
    "Fails due to expiresIn provided in signOption along with payload.exp, Signer: %p",
    async (
      signFunc: Signer,
      address: string,
      verifierID: number | undefined,
      algorithm: string
    ) => {
      expect(
        sign(
          {
            nonce: 654321,
            iat: 1582062696,
            exp: 1782098690,
            iss: address,
          },
          signFunc,
          { verifierID, algorithm, expiresIn: "12231132112" }
        )
      ).rejects.toThrow(InvalidPayloadError);
    }
  );
});
