import { StatusCodes } from "http-status-codes"
import { BaseError } from "../../common/error/BaseError"

export class CartError extends BaseError {
    constructor(name: string, httpCode: number, message: string) {
        super(name, httpCode, message)
    }
    static notFound(): CartError {
        return new CartError(this.name, StatusCodes.NOT_FOUND, 'Cart not found')
    }
    static invalidId(): CartError {
        return new CartError(this.name, StatusCodes.UNPROCESSABLE_ENTITY, 'Invalid cart id')
    }
}