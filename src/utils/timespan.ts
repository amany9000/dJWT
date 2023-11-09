import ms from "ms";
import { TimespanDecodingError } from "../errors";

export function timespan(time: string | number, timestamp: number): number {
  if (typeof time === "string") {
    let milliseconds: any = ms(time);
    if (typeof milliseconds === "undefined") {
      throw new TimespanDecodingError("Error while decoding time", time);
    }
    return Math.floor(timestamp + milliseconds / 1000);
  } else if (typeof time === "number") {
    return timestamp + time;
  } else {
    throw new TimespanDecodingError(
      "Time is not of the tpye number or string",
      time
    );
  }
}
