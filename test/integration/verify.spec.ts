import {web3Sign, signEthers, signPolkadot, validateSigPolkadot} from "../sharedFixtures";
import {sign, verify} from "../../src"
import { expect, describe, it } from '@jest/globals';
import {eth} from "web3";
import * as ethers from "ethers";
import { Signer, Verifier } from "../../src";

describe("Test for verification: verify()", () => {

    it.each([
        [web3Sign, eth.accounts.recover as Verifier, "0x231a5147b7c2bDF1dc8449Da0DeF741077447bCD", 1, undefined],
        [signEthers, ethers.verifyMessage as Verifier, "0x145831eba8085d78c1d30A9C108aAD8A1501d6e0", 1, undefined],
        [signPolkadot, validateSigPolkadot as Verifier, "5F7MBfGdyTg5th5gzsWMUyaVBRUkhEZw5Q82rPrtSP1q9F3E", 0, "SR25519"]
    ])
    ('sign the payload with %p, get the token and verify it with %p',
     async (signFunc: Signer, verifierFunc: Verifier, address: string, verifierID: number, algorithm: string | undefined) =>{
        const payload = {
            "nonce" : 654321,
            "iat" : 1582062696,
            "exp" : 1782098690,
            "iss" : address
        }
        const token = await sign(payload, signFunc, {verifierID, algorithm})

        expect(token).not.toBe(void 0);
        expect(typeof(token)).toBe("string");
        expect(token.split('.').length).toBe(3);

        console.log("token", token)
        const receivedToken = verify( verifierFunc, token);
        expect(receivedToken.payload).toMatchObject(payload);
        expect(receivedToken.signature).toBeDefined()
        expect(typeof(receivedToken.signature)).toBe("string");
    });
});
