import Joi from "joi"

export const idNumberOrError = (param: unknown): Error | number => {
    return Joi.attempt(param, Joi.number(), "id")
}