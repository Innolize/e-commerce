import { StatusCodes } from "http-status-codes"
import { BaseError } from "../../common/error/BaseError"

export class PaymentError extends BaseError {
    constructor(public name: string, public httpCode: number, public message: string) {
        super(name, httpCode, message);
        Object.setPrototypeOf(this, new.target.prototype);
    }
    static notFound(): PaymentError {
        return new PaymentError(this.name, StatusCodes.NOT_FOUND, 'Payment not found.')
    }
}