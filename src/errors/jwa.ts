import { BaseDjwtError } from './baseDjwtError';

export class JwaVerifyError extends BaseDjwtError {
  public argument: any;
  public constructor(message: string, arg: any) {
    super(message);
    this.argument = arg;
  }
}