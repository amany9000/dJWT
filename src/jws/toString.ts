import { Buffer } from "buffer";

export function toString(obj: object): string {
  if (typeof obj === "string") return obj;
  if (typeof obj === "number" || Buffer.isBuffer(obj)) return obj.toString();
  return JSON.stringify(obj);
}
