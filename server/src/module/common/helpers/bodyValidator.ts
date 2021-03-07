import { Schema, ValidationError } from 'joi'


export const bodyValidator = async (schema: Schema, validateObject: unknown): Promise<unknown> => {
    return await schema.validateAsync(validateObject, { stripUnknown: true, abortEarly: false })
}

export const mapperMessageError = (err: ValidationError): string[] => {
    return err.details.map((x) => x.message);
}