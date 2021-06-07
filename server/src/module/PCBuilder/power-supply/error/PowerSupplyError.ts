import { StatusCodes } from "http-status-codes"
import { BaseError } from "../../../common/error/BaseError";


export class PowerSupplyError extends BaseError {
    constructor(public name: string, public httpCode: number, public message: string) {
        super(name, httpCode, message);
        Object.setPrototypeOf(this, new.target.prototype);
    }
    static notFound() {
        return new PowerSupplyError(this.name, StatusCodes.NOT_FOUND, 'Power supply not found')
    }
    static invalidId(){
        return new PowerSupplyError(this.name, StatusCodes.UNPROCESSABLE_ENTITY, 'Invalid power supply id')
    }
}