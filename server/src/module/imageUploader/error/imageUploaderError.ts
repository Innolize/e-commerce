import { StatusCodes } from "http-status-codes";
import { BaseError } from "../../common/error/BaseError";

export class ImageUploaderError extends BaseError{
    constructor(public name: string, public httpCode: number, public message: string) {
        super(name, httpCode, message);
        Object.setPrototypeOf(this, new.target.prototype);
    }
    static inexistentExtension() {
        return new ImageUploaderError(this.name, StatusCodes.NOT_FOUND, 'Image has no extension')
    }

    static UnexpectedPath() {
        return new ImageUploaderError(this.name, StatusCodes.UNPROCESSABLE_ENTITY, 'Unexpected image path')
    }
}