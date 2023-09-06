import { BaseDjwtError } from './baseDjwtError';

export class JwsDecodingError extends BaseDjwtError {
	public jwt? : string;

	public constructor(message : string, token? : string) {
		super(message);
		this.jwt = token;
	}
}

export class JwsVerifyError extends BaseDjwtError {

	public constructor(message : string) {
		super(message);
	}
}