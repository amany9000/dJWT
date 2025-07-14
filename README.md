<div align='center'>
  
<a href='https://github.com/amany9000/djwt/releases'>

<img src='https://img.shields.io/github/v/release/amany9000/djwt?color=%23FDD835&label=version'>
  
</a>
  
<a href='https://github.com/amany9000/djwt/blob/main/LICENSE'>
  
<img src='https://img.shields.io/github/license/amany9000/djwt'>
  
</a>

<a href='https://www.npmjs.com/package/djwt'>

<img src='https://img.shields.io/npm/v/djwt'>
  
</a>
  
</div>

![Logo](./img/djwt-logo.jpeg)

---

<br />

# dJWT

A general purpose, Digital Signature-agnostic JWT implementation. You can plug in any Digital Signature Algorithm (DSA) using the correct [Signer](https://github.com/amany9000/dJWT/blob/28a64bd25247d4a37eb116208b31be7253a90df2/src/types.ts#L52) and [Verifier](https://github.com/amany9000/dJWT/blob/28a64bd25247d4a37eb116208b31be7253a90df2/src/types.ts#L56) interfaces.

Compatibile with the current (ECDSA/RSA) and [post-quantum](https://github.com/amany9000/post-quantum-jwt) Digital Signature Schemes (Dilithium/SPHINCS+). Tested for several [major blockchains](./examples): EVM-based(ethers/metamask), Polkadot, Bitcoin.

## Installation

```sh
npm install djwt
```

## Tested Libraries/Wallets

These DLT Packages/Wallets have been tested with djwt->>>>

- [Web3.js](https://github.com/ethereum/web3.js)
- [Ethers.js](https://github.com/ethers-io/ethers.js)
- [Polkadot.js](https://github.com/polkadot-js)
- [Bitcoinjs](https://github.com/bitcoinjs/bitcoinjs-lib)
- [Metamask](https://github.com/metamask)

## Post-Quantum DSA

As post-quantum algorithms are in their infancy right now, their landscape is changing constantly with new implementations coming in every year. Hence, djwt's Pluggable DSA is very useful in implementing these future-proof JWTs.

The [post-quantum-jwt](https://github.com/amany9000/post-quantum-jwt) POC showcases djwt's compatibility with Post-Quantum DSAs. It utilises [noble-post-quantum](https://github.com/paulmillr/noble-post-quantum) in the backgroud to implement the following DSA Schemes:

- [DILITHIUM](https://pq-crystals.org/dilithium/index.shtml)
- [SPHINCS](https://sphincs.org/index.html)

## How to use 🛠️

- For function specification refer to [Documentation](./DOCS.md).
- Check out the [examples](./examples/) section for small working projects on the above mentioned signer libraries/wallets.
- You can look at the types in [types.ts](./src/types.ts).

---

## ✍️ Contributing

Found a bug? Create an [issue](https://github.com/amany9000/djwt/issues).

If you have a contribution in mind, please check out our [Contribution Guide](https://github.com/amany9000/dJWT/blob/main/CONTRIBUTING.md) for information on how to do so.

---

## 🌟 Spread the word!

If you want to say thank you and/or show support for dJWT:

- Star to the project!
- Tweet about the project on Twitter and tag me: [@amany_9000](https://twitter.com/amany_9000)

---

### Developer 🧑🏻‍💻

- [Myself](https://github.com/amany9000)
