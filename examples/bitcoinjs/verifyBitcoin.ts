import {verify} from 'bitcoinjs-message';

export function verifyBitcoin(msg: string, signature: string, address: string) {
    return verify(msg, address, signature);
}  
