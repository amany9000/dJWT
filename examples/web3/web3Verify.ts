import { eth } from "web3";

export const web3Verify = (data: string, signature: string) => eth.accounts.recover(data, signature);