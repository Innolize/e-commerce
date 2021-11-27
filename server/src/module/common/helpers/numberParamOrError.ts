import Joi from "joi"

export const numberParamOrError = (param: string): number => {

    return Joi.attempt(param, Joi.number())
}