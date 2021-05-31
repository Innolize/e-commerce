import { StatusCodes } from "http-status-codes"
import { BaseError } from "../../common/error/BaseError"

export class CategoryError extends BaseError {
    constructor(name: string, httpCode: number, message: string) {
        super(name, httpCode, message)
    }
    static notFound() {
        return new CategoryError(this.name, StatusCodes.NOT_FOUND, 'Category not found')
    }
    static invalidId() {
        return new CategoryError(this.name, StatusCodes.UNPROCESSABLE_ENTITY, 'Invalid Category id')
    }

    static invalidQueryParam(query: string) {
        return new CategoryError(this.name, StatusCodes.UNPROCESSABLE_ENTITY, `Invalid Category query "${query}"`)
    }
}