import { StatusCodes } from "http-status-codes"

export class BaseError extends Error {
    public readonly name: string
    public readonly httpCode: StatusCodes
    public readonly message: string

    constructor(name: string, httpCode: number, message: string) {
        super(message)
        Object.setPrototypeOf(this, new.target.prototype);
        this.name = name,
            this.httpCode = httpCode
        this.message = message
        Error.captureStackTrace(this)
    }

    static idParamNotDefined(): BaseError {
        return new BaseError(this.name, StatusCodes.BAD_REQUEST, "Invalid id param.")
    }
    static validateNumber(number: unknown, errorMessage = "Invalid id param"): number {
        const validNumber = Number(number)
        if (!validNumber || validNumber <= 0) {
            throw new BaseError(this.name, StatusCodes.BAD_REQUEST, errorMessage)
        }
        return validNumber
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static validateNonEmptyForm(formDto: Record<string, any> | undefined | null): Record<string, any> {
        if (!formDto || !Object.keys(formDto).length) {
            throw new BaseError(this.name, StatusCodes.UNPROCESSABLE_ENTITY, 'Form cannot be empty!')
        }
        return formDto
    }
}