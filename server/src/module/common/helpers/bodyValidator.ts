import Joi, { Schema, Err } from 'joi'


export const bodyValidator = async (schema: Schema, validateObject: Object) => {
    return await schema.validateAsync(validateObject, { stripUnknown: true, abortEarly: false })
}

export const mapperMessageError = (err: any): string[] => {
    return err.details.map((x: any) => x.message);
}