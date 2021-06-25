import { StatusCodes } from "http-status-codes"
import { BaseError } from "../../common/error/BaseError"

export class AuthenticationError extends BaseError {
    constructor(public name: string, public httpCode: number, public message: string) {
        super(name, httpCode, message);
        Object.setPrototypeOf(this, new.target.prototype);
    }
    static refreshTokenNotFound(): AuthenticationError {
        return new AuthenticationError(this.name, StatusCodes.NOT_FOUND, 'Refresh token not found!')
    }

    static notLogged(): AuthenticationError {
        return new AuthenticationError(this.name, StatusCodes.BAD_REQUEST, 'You were not logged')
    }
}