import { StatusCodes } from "http-status-codes"
import { BaseError } from "../../../common/error/BaseError";


export class DiskStorageError extends BaseError {
    constructor(public name: string, public httpCode: number, public message: string) {
        super(name, httpCode, message);
        Object.setPrototypeOf(this, new.target.prototype);
    }
    static notFound() {
        return new DiskStorageError(this.name, StatusCodes.NOT_FOUND, 'Cabinet not found')
    }
    static invalidId(){
        return new DiskStorageError(this.name,StatusCodes.UNPROCESSABLE_ENTITY, 'Invalid cabinet id')
    }
}