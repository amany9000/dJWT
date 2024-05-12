
export function isHexString(str: string): { str: string, isHex: boolean } {
    if (str.slice(0, 2) === '0x') {
        str = str.split('0x')[1];
    }
    const regExp = /^[0-9a-fA-F]+$/;

    if (regExp.test(str))
        return { str, isHex: true }
    
    return { str, isHex: false };
}
