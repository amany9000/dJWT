import Web3 from 'web3';
import fs from "fs";


export async function getWallet(web3 : Web3){
    const readKeystore =  JSON.parse(fs.readFileSync("test/sharedFixtures/keystore.json").toString());
    const decryptedAccount = await web3.eth.accounts.decrypt(readKeystore[0], 'pass_12345678');
    return decryptedAccount;
}


export async function getWeb3(){
    return new Web3();
}


export async function getContract(web3 : Web3, address? : string){
    const abi = JSON.parse(fs.readFileSync("artifact.json").toString())["abi"]
    
    // @user, this address will come from environment variable
    return address ? new web3.eth.Contract(abi, address) : new web3.eth.Contract(abi);
}
