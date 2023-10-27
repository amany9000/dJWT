import {metamaskSign} from "./metamaskSign";
import {metamaskVerify} from "./metamaskVerify";
import {sign, verify} from "djwt";

(async function test() {
    const address = "0x29c76e6ad8f28bb1004902578fb108c507be341b";
    const algorithm = "ES256k";

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
      const token = await sign(payload, metamaskSign, { algorithm });

      console.log(`Signed JWT token: ${token}`)

      const receivedToken = verify(metamaskVerify, token, {
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