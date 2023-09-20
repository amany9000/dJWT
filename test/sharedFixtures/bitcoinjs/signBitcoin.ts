import {ECPairFactory} from 'ecpair'; // v4.x.x
import * as TinySecp256k1Interface from 'tiny-secp256k1';
import {sign} from 'bitcoinjs-message';



export function signBitcoin(message: string){
    const ecPair = ECPairFactory(TinySecp256k1Interface);

    //Address: 1HZwtseQ9YoRteyAxzt6Zq43u3Re5JKPbk
    var keyPair = ecPair.fromWIF('KynD8ZKdViVo5W82oyxvE18BbG6nZPVQ8Td8hYbwU94RmyUALUik')
    
    var privateKey = keyPair.privateKey;
    if(!privateKey){
        throw new Error("Unable to decode PrivateKey");
    }
    
    var signature = sign(message, privateKey, keyPair.compressed)
    return signature.toString('base64');
    
}