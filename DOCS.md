# `Documentation`

## **Installation**:

```console
npm install djwt
```

## **Functions**:

### **`async function sign(payload: Payload, signer: Signer, options Partial<SignOptions>) : Promise<string>`**

(Asynchronous) Return a JSON Web Token (string) after signing the `payload.header` with the signer().

**Parameters**

| parameter    | required/optional | type | description |
|    :---:     |     :---:      |     :---:     |     :---:     |
| payload   | required     | Payload   |  JWT Payload |
| signer   | required     | Signer   |  Function that will sign the `payload.header` (see function signature below) |
| options   | required     | SignOptions   | JWT Creation Options (must contain header or algorithm) |

`Type Payload fields:`
* `iss`   (string) - Issuer claim, address of the issuer of the JWT.
* `nonce`  (number) - Random signature nonce.
* `exp`  (string) - Expiration claim, expiration timestamp of the JWT.
* `iat`  (number) (optional) - Issued at  claim, issuance timestamp of the JWT.
* `nbf`  (number) (optional) - Not before claim, the time span before which the JWT
is invalid.
* `sub`  (string) (optional) - Subject claim, the subject of the JWT.
* `jti`  (string) (optional) - The JWT ID claim, unique identifier for the JWT.
* `aud`  (string | string[]) (optional) - The Audience claim, recipient or group of recipients of the JWT.

`Interface Signer:`
* Signer is your JWT (`payload.header`) signing function which must satisfy this call signature : 
```js   
(payload: string): Promise<string> | string; 
```
For example, [signBitcoin](./examples/bitcoinjs/signBitcoin.ts) is a valid Signer.

`Type SignOptions fields:`
* `algorithm` (string) - The algorithm used for signing `payload.header` by `signer()`.
* `header` (Header) - The Header object of the JWT.
* `encoding` (string) (optional) - The encoding for the JWT.
* `noTimestamp` (boolean) (optional): `iat` (issued at) field is not included in the payload if noTimestamp is set `true`.
* `expiresIn` (number | string) (optional): The time span of JWT expiration. All inputs for [ms](https://github.com/vercel/ms) are valid.
* `notBefore` (number | string) (optional): The time span before which the JWT is invalid. All inputs for [ms](https://github.com/vercel/ms) are valid.

**Return Type** 
* Returns the JWT string as `Promise<string>`.

**Example**
```js
async function test() {
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
}

// metamaskSign.ts
import {personalSign} from "@metamask/eth-sig-util";

function metamaskSign(message: string): string{
    const key = Buffer.from("4af1bceebf7f3634ec3cff8a2c38e51178d5d4ce585c52d6043e5e2cc3418bb0", 'hex');
    const signature = personalSign({ privateKey: key, data: message });
    return signature;
}

```

### **`function verify(jwtString: string, verifier: Verifier, options?: Partial<VerifyOptions>): TokenOrPayload `**

Verifies the JWT string for claims and signature and returns the entire token object or just the payload object. Signature verification is done using the `verifier` function.

**Parameters**

| parameter    | required/optional | type | description |
|    :---:     |     :---:      |     :---:     |     :---:     |
| jwtString   | required     | string   |  The JWT |
| verifier   | required     | Verifier   | Fuction that will verify the signature in the JWT. |
| options   | optional     | `Partial<VerifyOptions>`   | JWT Verification Options |

`Interface Verifier:`
* Verifier is your JWT signature verification function which must satisfy this call signature : 
```js   
(payload: string, signature: string, address: string): boolean | string;
```
* If verifier returns a string then that string will be matched with `address`(`payload.iss`), you can pass in a function with signature call `(payload: string, signature: string): string` in case you are using some address recovery function (used in ECDSA in the EVM-based chains), for e.g. [web3Verify](./examples/web3/web3Verify.ts) and [metamaskVerify](./examples/metamask/metamaskVerify.ts).
* [verifyPolkadot](./examples/polkadot.js/verifyPolkadot.ts) is a also valid Verifier.

`Type VerifyOptions fields:`
* `algorithm` (string) - To be matched with `header.alg` during verification.
* `complete` (boolean) - `verify` returns the`Token` object if `options.complete=true` otherwise it returns just the `Payload` object.
* `issuer`  (string | string[]) - Will be matched with the Issuer claim: `token.payload.iss`.
* `subject`  (string) - Will be matched with the Subject claim: `token.payload.sub`.
* `jwtid`  (string) - Will be matched with the JWT ID claim: `token.payload.jti`.
* `audience`  (string | string[]) - Will be matched with the Audience claim: `token.payload.aud`.
* `nonce`  (number) - Will be matched with the signature nonce: `token.payload.nonce`.
* `maxage`  (number | string) - The timestamp till which the token is valid. All inputs for [ms](https://github.com/vercel/ms) are valid.
* `clockTimestamp` (number): The time in seconds, to be used as the current time.
* `clockTolerance` (number): The number of seconds to tolerate when checking for all time-based claims: nbf, exp and maxage.
* `ignoreExpiration` (boolean): If true, ignore the Expiration claim: `token.payload.exp`.
* `ignoreNotBefore` (boolean): If true, ignore the Not Before claim: `token.payload.nbf`.

Note: Since `options` are of the type `Partial<VerifyOptions>`, all these fields are optional.

**Return Type** 
Returns the either the `Token` object if `options.complete=true` otherwise just returns the `Payload` object.

`Type Token fields:`
* `header` (Header) - The Header object of the JWT.
* `payload` (Payload) - The Payload object of the  (see above for Payload type fields).
* `signature` (String) - The signature string of the JWT.


**Example**
```js
  import {verifyMessage} from "ethers";
  
  const address = "0x145831eba8085d78c1d30A9C108aAD8A1501d6e0";
  const algorithm = "ES256k";

  const receivedToken = verify(tokenString, verifyMessage, {
    complete: true,
    nonce: 654321,
    maxAge: 10000000000,
    issuer: address,
    jwtid: "324221",
    subject: address,
    audience: "0x75FaBc80c774614C424ffC1d7017b4a534607935",
    algorithm,
  });
```