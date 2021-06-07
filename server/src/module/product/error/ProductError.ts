import { StatusCodes } from "http-status-codes"
import { BaseError } from "../../common/error/BaseError"

export class ProductError extends BaseError {
    constructor(public name: string, public httpCode: number, public message: string) {
        super(name, httpCode, message);
        Object.setPrototypeOf(this, new.target.prototype);
    }
    static notFound() {
        return new ProductError(this.name, StatusCodes.NOT_FOUND, 'Product not found')
    }

    static nameMissing() {
        return new ProductError(this.name, StatusCodes.UNPROCESSABLE_ENTITY, 'Product name missing')
    }

    static idMissing() {
        return new ProductError(this.name, StatusCodes.UNPROCESSABLE_ENTITY, 'Product id missing')
    }

    static invalidId() {
        return new ProductError(this.name, StatusCodes.UNPROCESSABLE_ENTITY, 'Invalid product id')
    }
}