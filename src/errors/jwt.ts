
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