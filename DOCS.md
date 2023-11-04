# `Documentation`

## **Installation**:

```console
npm install djwt
```

## **Usage**:

### **async function sign(payload: Payload, signer: Signer, options Partial<SignOptions>)**

(Asynchronous) Return a JSON Web Token after signer the `payload.header` with the signer().

**Parameters**

| parameter    | required/optional | type | description |
|    :---:     |     :---:      |     :---:     |     :---:     |
| payload   | required     | Payload   | Payload to signed |
| signer   | required     | Signer   |  Function that will sign the `payload.header` (see function signature below) |
| options   | required     | SignOptions   | Options for signer (must contain header or algorithm) |

`Type Payload fields:`
* `iss` (string) - Issuer claim, address of the issuer of the JWT.
* `nonce` (number) - Random signature nonce.
* `exp` (string) - Expiration claim, expiration timestamp of the JWT.
* `iat` (number) (optional) - The issued at  claim, issuance timestamp of the JWT.
* `nbf` (number) (optional) - Not before claim, the time span before which the JWT
is invalid.
* `sub` (string) (optional) - Subject claim, the subject of the JWT.
* `jti` (string) (optional) - The JWT ID claim, unique identifier for the JWT.
* `aud` (string | string[]) (optional) - The Audience claim, recipient or group of recipients of the JWT.

`Interface Signer:`
Signer is your JWT (`payload.header`) signing function which must satisfy this call signature : 
```js   
(payload: string): Promise<string> | string; 
```
[signBitcoin](./examples/bitcoinjs/signBitcoin.ts) is a valid Signer.

`Type SignOptions fields:`
* `algorithm` (string) - The algorithm used for signing `payload.header` by `signer()`.
* `header` (Header) - The Header object of the JWT.
* `encoding` (string) (optional) - The encoding for the JWT.
* `noTimestamp` (boolean) (optional): `iat` (issued at) field is not included in the payload if noTimestamp is set `true`.
* `expiresIn` (number | string) (optional): The time span of JWT expiration. All inputs for [ms](https://github.com/vercel/ms) are valid.
* `notBefore` (number | string) (): The time span before which the JWT is invalid. All inputs for [ms](https://github.com/vercel/ms) are valid.


**Example**
```js
  const address = "1HZwtseQ9YoRteyAxzt6Zq43u3Re5JKPbk";
  const algorithm = "ES256k";

  const payload = {
    nonce: 654321,
    exp: 1782098690,
    iss: address,
  };
  const token = await sign(payload, signBitcoin, { algorithm });
```