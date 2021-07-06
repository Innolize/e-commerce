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
}