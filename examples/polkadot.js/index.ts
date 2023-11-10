import {signPayload} from "./wallet";
import { validateSigPolkadot } from "./verifyPolkadot";

import { sign, verify } from "djwt";


(async function test() {
    const address = "5GHZTxY7iZ8PK2ipPeB7oF33KiURKhyRPXBhyBhiQVHGfS1A";
    const algorithm = "SR25519";

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
      const token = await sign(payload, signPayload, { algorithm });

      console.log(`Signed JWT token: ${token}`)

      const receivedToken = verify(token, validateSigPolkadot, {
        complete: true,
        nonce: 654321,
        maxAge: 10000000000,
        issuer: address,
        jwtid: "324221",
        subject: address,
        audience: "0x75FaBc80c774614C424ffC1d7017b4a534607935",
        algorithm,
      });

      console.log(`Decode JWT token JSON returned after verification:`, receivedToken)
})()