import {ECPairFactory} from 'ecpair'; // v4.x.x
import * as TinySecp256k1Interface from 'tiny-secp256k1';
import {sign} from 'bitcoinjs-message';



export function signBitcoin(message: string){
    const ecPair = ECPairFactory(TinySecp256k1Interface);

    let keyPair = ecPair.fromWIF('KynD8ZKdViVo5W82oyxvE18BbG6nZPVQ8Td8hYbwU94RmyUALUik')
    
    let privateKey = keyPair.privateKey;
    if(!privateKey){
        throw new Error("Unable to decode PrivateKey");
    }
    
    let signature = sign(message, privateKey, keyPair.compressed)
    return signature.toString('base64');
    
}