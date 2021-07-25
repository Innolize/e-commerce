import Joi from "joi"

export const numberParamOrError = (paramObject: unknown, param: string): number => {
    return Joi.attempt(paramObject, Joi.number(), param)
}