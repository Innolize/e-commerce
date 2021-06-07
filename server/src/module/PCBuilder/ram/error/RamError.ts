import { StatusCodes } from "http-status-codes"
import { BaseError } from "../../../common/error/BaseError";


export class RamError extends BaseError {
    constructor(public name: string, public httpCode: number, public message: string) {
        super(name, httpCode, message);
        Object.setPrototypeOf(this, new.target.prototype);
    }
    static notFound() {
        return new RamError(this.name, StatusCodes.NOT_FOUND, 'Ram not found')
    }
}