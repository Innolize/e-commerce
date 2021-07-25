import { StatusCodes } from "http-status-codes"
import { BaseError } from "../../common/error/BaseError"

export class UserError extends BaseError {
    constructor(name: string, httpCode: number, message: string) {
        super(name, httpCode, message)
    }
    static notFound(): UserError {
        return new UserError(this.name, StatusCodes.NOT_FOUND, 'User not found')
    }
    static mailAlreadyInUse(): UserError {
        return new UserError(this.name, StatusCodes.CONFLICT, 'Mail already in use')
    }
    static invalidId(): UserError {
        return new UserError(this.name, StatusCodes.UNPROCESSABLE_ENTITY, 'Invalid user id')
    }
}