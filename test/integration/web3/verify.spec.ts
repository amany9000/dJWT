import {web3Sign} from "../../sharedFixtures";
import {sign, verify} from "../../../src"
import { expect, describe, it } from '@jest/globals';
import {eth} from "web3";
import { Verifier } from "../../../src/types";

describe("Test for verification: verify()", () => {

    it('sign the payload, get the token and verify it', async () => {
        const payload = {
            "nonce" : 654321,
            "iat" : 1582062696,
            "exp" : 1782098690,
            "iss" : "0x231a5147b7c2bDF1dc8449Da0DeF741077447bCD"
        }
        const token = await sign(payload, web3Sign, {verifierID: 1})

        expect(token).not.toBe(void 0);
        expect(typeof(token)).toBe("string");
        expect(token.split('.').length).toBe(3);

        const receivedToken = verify(eth.accounts.recover as Verifier, token);
        expect(receivedToken.payload).toMatchObject(payload);
        expect(receivedToken.signature).toBeDefined()
        expect(typeof(receivedToken.signature)).toBe("string");
    });
});
