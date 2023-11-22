import { BaseDjwtError } from "./baseDjwtError";

export class TokenExpiredError extends BaseDjwtError {
  public expiredAt: number;

  public constructor(message: string, expiredAt: number) {
    super(message);
    this.expiredAt = expiredAt;
  }
}

export class NotBeforeError extends BaseDjwtError {
  public date: number;

  public constructor(message: string, date: number) {
    super(message);
    this.date = date;
  }
}

export class TimespanDecodingError extends BaseDjwtError {
  public time: number | string;

  public constructor(message: string, date: number | string) {
    super(message);
    this.time = date;
  }
}

export class VerificationError extends BaseDjwtError {
  public constructor(message: string) {
    super(message);
  }
}
export class OptionsVerificationError extends BaseDjwtError {
  public incorrectValue: string | number;
  public expectedValue: string | number;

  public constructor(
    message: string,
    incorrectValue: string | number,
    expectedValue: string | number
  ) {
    super(
      message + ` ${incorrectValue} is not equal to expected: ${expectedValue}`
    );
    this.incorrectValue = incorrectValue;
    this.expectedValue = expectedValue;
  }
}

export class InvalidPayloadError extends BaseDjwtError {
  public constructor(message: string) {
    super(message);
  }
}

export class InvalidSignOptionsError extends BaseDjwtError {
  public payloadValue?: string;
  public optionsValue?: string;

  public constructor(
    message: string,
    payloadVal?: string,
    optionsVal?: string
  ) {
    super(message);
    this.payloadValue = payloadVal;
    this.optionsValue = optionsVal;
  }
}
