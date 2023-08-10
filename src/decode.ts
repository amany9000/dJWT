import {decodeJws} from "./jws";
import {Token, Payload} from "./types"


export function decode(jwt: string, returnHeader? : boolean) : Token | null{
  var decoded = decodeJws(jwt);
  if (!decoded) { return null; }
  
  var payload: Payload | string = decoded.payload;

  //try parse the payload
  if(typeof payload === 'string') {
    try {
      var obj : Payload = JSON.parse(payload);
      if(obj !== null) {
        payload = obj;
      }
    } catch (e) { }
  }

  if (returnHeader)
    return {
      header: decoded.header,
      payload: payload,
      signature: decoded.signature
    };
  else
    return {
      payload: payload,
      signature: decoded.signature
    };
};
