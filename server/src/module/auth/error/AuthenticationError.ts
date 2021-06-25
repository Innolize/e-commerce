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
        return new AuthenticationError(this.name, StatusCodes.UNPROCESSABLE_ENTITY, 'You were not logged')
    }

    static idMissing() {
        return new AuthenticationError(this.name, StatusCodes.UNPROCESSABLE_ENTITY, 'Product id missing')
    }

    static invalidId() {
        return new AuthenticationError(this.name, StatusCodes.UNPROCESSABLE_ENTITY, 'Invalid product id')
    }
}