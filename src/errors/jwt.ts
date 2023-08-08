
import { BaseDjwtError } from './baseDjwtError.js';

export class TokenExpiredError extends BaseDjwtError {
	public expiredAt : number;

	public constructor(message : string, expiredAt : number) {
		super(message);
		this.expiredAt = expiredAt;
	}
}


export class NotBeforeError extends BaseDjwtError {
	public date : number;

	public constructor(message : string, date : number) {
		super(message);
		this.date = date;
	}
}

export class TimespanDecodingError extends BaseDjwtError {
	public time : number | string;

	public constructor(message : string, date : number | string) {
		super(message);
		this.time = date;
	}
}

export class VerificationError extends BaseDjwtError {

	public constructor(message : string) {
		super(message);
	}
}