import { BaseDjwtError } from './baseDjwtError.js';

export class JwaVerifyError extends BaseDjwtError{
    public argument: number; 
	public constructor(message: string, arg: number) {
		super(message);
        this.argument = arg;
	}
}