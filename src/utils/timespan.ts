import * as ms from "ms"

export function timespan(time, iat) {
  var timestamp = iat || Math.floor(Date.now() / 1000);

  if (typeof time === 'string') {
    var milliseconds : any = ms(time);
    if (typeof milliseconds === 'undefined') {
      return;
    }
    return Math.floor(timestamp + milliseconds / 1000);
  } else if (typeof time === 'number') {
    return timestamp + time;
  } else {
    return;
  }

};