import { Schema, ValidationError } from 'joi'


export const bodyValidator = async <T>(schema: Schema, validateObject: T): Promise<T> => {
    return schema.validateAsync(validateObject, { stripUnknown: true, abortEarly: false })
}

type customErrorObject = {
    [key: string]: string
}

export const mapperMessageError = (err: ValidationError): customErrorObject[] => {
    const result = err.details.map(error => { return { [error.path[0]]: error.message } });
    return result
}