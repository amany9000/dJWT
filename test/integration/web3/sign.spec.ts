import {web3Sign} from "../../sharedFixtures";
import {sign} from "../../../src"
import { expect, describe, it } from '@jest/globals';

describe("Test for signing: sign()", () => {

    it('sign the payload and get the token', async () => {
        const token = await sign({
            "nonce" : 654321,
            "iat" : 1582062696,
            "exp" : 1782098690,
            "iss" : "0x231a5147b7c2bDF1dc8449Da0DeF741077447bCD"
        }, web3Sign, {verifierID: 1})

        expect(token).not.toBe(void 0);
        expect(typeof(token)).toBe("string");
        expect(token.split('.').length).toBe(3);
    });
});
