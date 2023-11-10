import {
  web3Sign,
  web3Verify,
  signEthers,
  signPolkadot,
  validateSigPolkadot,
  signBitcoin,
  verifyBitcoin,
  metamaskSign,
  metamaskVerify,
} from "../sharedFixtures";
import { sign, verify } from "../../src";
import { expect, describe, it } from "@jest/globals";
import * as ethers from "ethers";
import { Signer, Verifier } from "../../src";

describe("Test for verification: verify()", () => {
  it.each([
    [
      web3Sign,
      web3Verify as Verifier,
      "0x231a5147b7c2bDF1dc8449Da0DeF741077447bCD",
      "ES256k",
    ],
    [
      signEthers,
      ethers.verifyMessage as Verifier,
      "0x145831eba8085d78c1d30A9C108aAD8A1501d6e0",
      "ES256k",
    ],
    [
      signPolkadot,
      validateSigPolkadot as Verifier,
      "5F7MBfGdyTg5th5gzsWMUyaVBRUkhEZw5Q82rPrtSP1q9F3E",
      "SR25519",
    ],
    [
      signBitcoin,
      verifyBitcoin as Verifier,
      "1HZwtseQ9YoRteyAxzt6Zq43u3Re5JKPbk",
      "ES256k",
    ],
    [
      metamaskSign,
      metamaskVerify as Verifier,
      "0x29c76e6ad8f28bb1004902578fb108c507be341b",
      "ES256k",
    ],
  ])(
    "sign the payload with %p, get the token and verify it with %p",
    async (
      signFunc: Signer,
      verifierFunc: Verifier,
      address: string,
      algorithm: string
    ) => {
      const payload = {
        nonce: 654321,
        iat: 1582062696,
        exp: 1782098690,
        iss: address,
        nbf: 100000000,
        sub: address,
        jti: "324221"
      };
      const token = await sign(payload, signFunc, { algorithm });
      expect(token).not.toBe(void 0);
      expect(typeof token).toBe("string");
      expect(token.split(".").length).toBe(3);

      const receivedToken = verify(token, verifierFunc, {
        complete: true,
        nonce: 654321,
        maxAge: 10000000000,
        issuer: address,
        jwtid: "324221",
        subject: address,
        algorithm,
      });
      expect(receivedToken.payload).toMatchObject(payload);
      expect(receivedToken.signature).toBeDefined();
      expect(typeof receivedToken.signature).toBe("string");
    }
  );

  it.each([
    [
      web3Sign,
      web3Verify as Verifier,
      "0x231a5147b7c2bDF1dc8449Da0DeF741077447bCD",
      "ES256k",
    ],
    [
      signEthers,
      ethers.verifyMessage as Verifier,
      "0x145831eba8085d78c1d30A9C108aAD8A1501d6e0",
      "ES256k",
    ],
    [
      metamaskSign,
      metamaskVerify as Verifier,
      "0x29c76e6ad8f28bb1004902578fb108c507be341b",
      "ES256k",
    ],
  ])(
    "Check the audience during signing with %p and verifying with %p",
    async (
      signFunc: Signer,
      verifierFunc: Verifier,
      address: string,
      algorithm: string
    ) => {
      
      // Audience in this case is an EVM-chain address of the verifier of the JWT.
      const payload = {
        nonce: 654321,
        iat: 1582062696,
        exp: 1782098690,
        iss: address,
        nbf: 100000000,
        sub: address,
        jti: "324221",
        aud: ["0x75FaBc80c774614C424ffC1d7017b4a534607935"]
      };
      const token = await sign(payload, signFunc, { algorithm });
      expect(token).not.toBe(void 0);
      expect(typeof token).toBe("string");
      expect(token.split(".").length).toBe(3);

      const receivedToken = verify( token, verifierFunc, {
        complete: true,
        nonce: 654321,
        maxAge: 10000000000,
        issuer: address,
        jwtid: "324221",
        subject: address,
        audience: "0x75FaBc80c774614C424ffC1d7017b4a534607935",
        algorithm,
      });
      expect(receivedToken.payload).toMatchObject(payload);
      expect(receivedToken.signature).toBeDefined();
      expect(typeof receivedToken.signature).toBe("string");
    }
  );

  it.each([
    [
      web3Sign,
      web3Verify as Verifier,
      "0x231a5147b7c2bDF1dc8449Da0DeF741077447bCD",
      "ES256k",
    ],
    [
      signEthers,
      ethers.verifyMessage as Verifier,
      "0x145831eba8085d78c1d30A9C108aAD8A1501d6e0",
      "ES256k",
    ],
    [
      signPolkadot,
      validateSigPolkadot as Verifier,
      "5F7MBfGdyTg5th5gzsWMUyaVBRUkhEZw5Q82rPrtSP1q9F3E",
      "SR25519",
    ]
  ])(
    "Signing with %p and verifying with %p without `complete:false`",
    async (
      signFunc: Signer,
      verifierFunc: Verifier,
      address: string,
      algorithm: string
    ) => {
      
      // Audience in this case is an EVM-chain address of the verifier of the JWT.
      const payload = {
        nonce: 654321,
        iat: 1582062696,
        exp: 1782098690,
        iss: address,
        nbf: 100000000,
        sub: address,
        jti: "324221",
        aud: ["0x75FaBc80c774614C424ffC1d7017b4a534607935"]
      };
      const token = await sign(payload, signFunc, { algorithm });
      expect(token).not.toBe(void 0);
      expect(typeof token).toBe("string");
      expect(token.split(".").length).toBe(3);

      const receivedPayload = verify( token, verifierFunc, {
        nonce: 654321,
        maxAge: 10000000000,
        issuer: address,
        jwtid: "324221",
        subject: address,
        audience: "0x75FaBc80c774614C424ffC1d7017b4a534607935",
        algorithm,
      });

      expect(receivedPayload).toBeDefined();
      expect(typeof receivedPayload).toBe("object");
      expect(receivedPayload).toMatchObject(payload);
    }
  );
});
