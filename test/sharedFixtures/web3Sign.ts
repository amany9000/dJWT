import {getWeb3, getWallet} from "./tokenUtils";

export async function web3Sign(payload: string) {
    try {
        const web3 = await getWeb3();
        const account = await getWallet(web3);
        return account.sign(payload).signature;        
    } 
    catch (err : any) {
        console.log("error", err);
        throw err;
    }
}
