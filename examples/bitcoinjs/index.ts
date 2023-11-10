import { signBitcoin } from "./signBitcoin";
import { verifyBitcoin } from "./verifyBitcoin";
import { sign, verify } from "djwt";

(async function test() {
  const address = "1HZwtseQ9YoRteyAxzt6Zq43u3Re5JKPbk";
  const algorithm = "ES256k";

  const payload = {
    nonce: 654321,
    iat: 1582062696,
    exp: 1782098690,
    iss: address,
    nbf: 100000000,
    sub: address,
    jti: "324221",
    aud: ["0x75FaBc80c774614C424ffC1d7017b4a534607935"],
  };
  const token = await sign(payload, signBitcoin, { algorithm });

  console.log(`Signed JWT token: ${token}`);

  const receivedToken = verify(token, verifyBitcoin, {
    complete: true,
    nonce: 654321,
    maxAge: 10000000000,
    issuer: address,
    jwtid: "324221",
    subject: address,
    audience: "0x75FaBc80c774614C424ffC1d7017b4a534607935",
    algorithm,
  });

  console.log(
    `Decode JWT token JSON returned after verification:`,
    receivedToken
  );
})();
