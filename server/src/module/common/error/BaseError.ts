import { StatusCodes } from "http-status-codes"

export class BaseError extends Error{
    public readonly name: string
    public readonly httpCode: StatusCodes
    public readonly message: string
    
    constructor(name: string, httpCode: number, message: string){
        super()
        this.name = name,
        this.httpCode = httpCode
        this.message = message
        Error.captureStackTrace(this)
    }
}