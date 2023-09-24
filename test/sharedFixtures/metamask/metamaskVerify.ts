import {recoverPersonalSignature} from "@metamask/eth-sig-util";

export const metamaskVerify = (message: string, signature: string) => recoverPersonalSignature({data: message, signature});
