import { BaseDjwtError } from './baseDjwtError';

export class JwaVerifyError extends BaseDjwtError {
  public argument: any;
  public constructor(message: string, arg: any) {
    super(message);
    this.argument = arg;
  }
}

export class JwaAddressIncorrectError extends BaseDjwtError {	
	public expectedAddress? : string; 
	public returnedAddress? : string; 
	
	public constructor(expectedAddress: string, returnedAddress: string) {
		super(`Expected address : ${expectedAddress}, does not match with Returned Address: ${returnedAddress}`);
		this.expectedAddress = expectedAddress;
		this.returnedAddress = returnedAddress;
	}
}