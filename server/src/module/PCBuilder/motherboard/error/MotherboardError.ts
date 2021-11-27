import { StatusCodes } from "http-status-codes"
import { BaseError } from "../../../common/error/BaseError";


export class MotherboardError extends BaseError {
    constructor(public name: string, public httpCode: number, public message: string) {
        super(name, httpCode, message);
        Object.setPrototypeOf(this, new.target.prototype);
    }
    static notFound(): MotherboardError {
        return new MotherboardError(this.name, StatusCodes.NOT_FOUND, 'Motherboard not found')
    }
    static invalidId(): MotherboardError {
        return new MotherboardError(this.name, StatusCodes.UNPROCESSABLE_ENTITY, 'Invalid motherboard id')
    }
}