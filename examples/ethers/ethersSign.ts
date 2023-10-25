import * as ethers from "ethers";
import fs from "fs";

export async function signEthers(payloadAndHeader: string) {
  const keystoreWallet = (fs.readFileSync('./keystoreWallet.json')).toString();

  const wallet = await ethers.Wallet.fromEncryptedJson(keystoreWallet, "pass_12345678");

  let messageDigest = ethers.hashMessage(payloadAndHeader)
  const signingKey = new ethers.SigningKey(wallet.privateKey);

  const signature = signingKey.sign(messageDigest);
  return signature.serialized;
};