export class ValueHubResult<T> {
    private constructor(
        public readonly isSuccess: boolean,
        private readonly _value?: T
    ) {}

    static Ok<T>(value: T) {
        return new ValueHubResult(true, value);
    }

    static readonly Error = new ValueHubResult<any>(false);

    get isError() {
        return !this.isSuccess;
    }

    get value() {
        if (!this.isSuccess) {
            throw new Error("Cannot access value of an error result.");
        }
        return this._value as T;
    }

    valueOr(other: T) {
        return this.isSuccess ? (this._value as T) : other;
    }

    errorOrValueIs(value: T) {
        return this.isError || this._value === value;
    }

    errorOrValueIsNot(value: T) {
        return this.isError || this._value !== value;
    }

    successAndValueIs(value: T) {
        return this.isSuccess && this._value === value;
    }

    successAndValueIsNot(value: T) {
        return this.isSuccess && this._value !== value;
    }
}

export class HubResult {
    static readonly Ok = new HubResult(true);
    static readonly Error = new HubResult(false);

    get IsError() {
        return !this.isSuccess;
    }

    constructor(readonly isSuccess: boolean) {}
}