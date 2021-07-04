import { StatusCodes } from "http-status-codes"
import { BaseError } from "../../common/error/BaseError"

export class OrderError extends BaseError {
    constructor(public name: string, public httpCode: number, public message: string) {
        super(name, httpCode, message);
        Object.setPrototypeOf(this, new.target.prototype);
    }
    static currentCartEmpty(): OrderError {
        return new OrderError(this.name, StatusCodes.NOT_FOUND, 'Impossible to create an order, no cart items in current cart')
    }

}