import { Schema, ValidationError } from 'joi'


export const bodyValidator = async <T>(schema: Schema, validateObject: T): Promise<T> => {
    return await schema.validateAsync(validateObject, { stripUnknown: true, abortEarly: false })
}

export const mapperMessageError = (err: ValidationError): string[] => {
    return err.details.map((x) => x.message);
}