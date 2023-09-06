import { BaseDjwtError } from './baseDjwtError';

export class JwaVerifyError extends BaseDjwtError{
    public argument: number; 
	public constructor(message: string, arg: number) {
		super(message);
        this.argument = arg;
	}
}