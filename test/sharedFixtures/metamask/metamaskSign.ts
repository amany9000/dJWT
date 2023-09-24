import {personalSign} from "@metamask/eth-sig-util";

export function metamaskSign(message: string): string{
    //Address: 0x29c76e6ad8f28bb1004902578fb108c507be341b 
    const key = Buffer.from("4af1bceebf7f3634ec3cff8a2c38e51178d5d4ce585c52d6043e5e2cc3418bb0", 'hex');
    const signature = personalSign({ privateKey: key, data: message });
    return signature;
}

