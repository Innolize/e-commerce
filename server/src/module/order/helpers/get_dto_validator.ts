import Joi from "joi"

export const validateGetOrderSchema = {
    limit: Joi.number(),
    offset: Joi.number()
}

export const validateGetOrderDto = Joi.object(validateGetOrderSchema)