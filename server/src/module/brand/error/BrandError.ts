import { StatusCodes } from "http-status-codes";
import { BaseError } from "../../common/error/BaseError";

export class BrandError extends BaseError{
    constructor(name: string,httpCode: number, message: string){
        super(name, httpCode, message)
    }
    static notFound(){
        return new BrandError(this.name,StatusCodes.NOT_FOUND, 'Brand not found')
    }
    static idMissing(){
        return new BrandError(this.name,StatusCodes.CONFLICT, 'Brand id missing')
    }
    static invalidId(){
        return new BrandError(this.name,StatusCodes.CONFLICT, 'Invalid brand id')
    }
}