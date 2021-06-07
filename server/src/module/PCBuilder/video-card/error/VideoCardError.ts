import { StatusCodes } from "http-status-codes"
import { BaseError } from "../../../common/error/BaseError";


export class VideoCardError extends BaseError {
    constructor(public name: string, public httpCode: number, public message: string) {
        super(name, httpCode, message);
        Object.setPrototypeOf(this, new.target.prototype);
    }
    static notFound() {
        return new VideoCardError(this.name, StatusCodes.NOT_FOUND, 'Video Card not found')
    }
}