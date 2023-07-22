
export interface DjwtError extends Error {
	readonly name: string;
	readonly code?: number;
	readonly stack?: string;
}

export abstract class BaseDjwtError extends Error implements DjwtError {
	public readonly name: string;
	public readonly code: number;
	public stack: string | undefined;
	public innerError: Error | Error[] | undefined;

	public constructor(msg?: string, innerError?: Error | Error[]) {
		super(msg);
		this.innerError = innerError;
		this.name = this.constructor.name;

		if (typeof Error.captureStackTrace === 'function') {
			Error.captureStackTrace(new.target.constructor);
		} else {
			this.stack = new Error().stack;
		}
	}

	public static convertToString(value: Error) {
		if (value === null || value === undefined) return 'undefined';

		const result = JSON.stringify(value);
		return result;
	}

	public toJSON() {
		return {
			name: this.name,
			code: this.code,
			message: this.message,
			innerError: this.innerError,
		};
	}
}
