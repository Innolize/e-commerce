import { StatusCodes } from "http-status-codes"
import { BaseError } from "../../../common/error/BaseError";


export class ProcessorError extends BaseError {
    constructor(public name: string, public httpCode: number, public message: string) {
        super(name, httpCode, message);
        Object.setPrototypeOf(this, new.target.prototype);
    }
    static notFound() {
        return new ProcessorError(this.name, StatusCodes.NOT_FOUND, 'Processor not found')
    }
    static invalidId(){
        return new ProcessorError(this.name, StatusCodes.UNPROCESSABLE_ENTITY, 'Invalid processor id')
    }
}