import {web3Sign, signEthers} from "../sharedFixtures";
import {sign} from "../../src"
import { expect, describe, it } from '@jest/globals';

import type {Signer} from "../../src"

describe("Test for signing: sign()", () => {

    it.each([
        [web3Sign, "0x231a5147b7c2bDF1dc8449Da0DeF741077447bCD"],
        [signEthers, "0x145831eba8085d78c1d30A9C108aAD8A1501d6e0"]
    ])
    ('sign with %p', async (signFunc: Signer, address: string) =>{
        const token = await sign({
            "nonce" : 654321,
            "iat" : 1582062696,
            "exp" : 1782098690,
            "iss" : address
        }, signFunc, {verifierID: 1})

        expect(token).not.toBe(void 0);
        expect(typeof(token)).toBe("string");
        expect(token.split('.').length).toBe(3);
    });
});
