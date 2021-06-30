import Joi from "joi"

export const validateCreateCartItemSchema = {
    product_id: Joi.number()
        .required(),
    quantity: Joi.number()
        .min(1)
        .required()
}

export const validateCreateCartItemDto = Joi.object(validateCreateCartItemSchema)