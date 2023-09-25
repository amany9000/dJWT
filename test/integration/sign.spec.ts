import {
  web3Sign,
  signEthers,
  signPolkadot,
  signBitcoin,
  metamaskSign,
} from "../sharedFixtures";
import { sign } from "../../src";
import { expect, describe, it } from "@jest/globals";

import type { Signer } from "../../src";

describe("Test for signing: sign()", () => {
  it.each([
    [web3Sign, "0x231a5147b7c2bDF1dc8449Da0DeF741077447bCD", 1, undefined],
    [signEthers, "0x145831eba8085d78c1d30A9C108aAD8A1501d6e0", 1, undefined],
    [
      signPolkadot,
      "5F7MBfGdyTg5th5gzsWMUyaVBRUkhEZw5Q82rPrtSP1q9F3E",
      0,
      "SR25519",
    ],
    [signBitcoin, "1HZwtseQ9YoRteyAxzt6Zq43u3Re5JKPbk", 0, undefined],
    [metamaskSign, "0x29c76e6ad8f28bb1004902578fb108c507be341b", 1, undefined],
  ])(
    "sign with %p",
    async (
      signFunc: Signer,
      address: string,
      verifierID: number,
      algorithm: string | undefined
    ) => {
      const token = await sign(
        {
          nonce: 654321,
          iat: 1582062696,
          exp: 1782098690,
          iss: address,
        },
        signFunc,
        { verifierID, algorithm }
      );

      expect(token).not.toBe(void 0);
      expect(typeof token).toBe("string");
      expect(token.split(".").length).toBe(3);
    }
  );
});
