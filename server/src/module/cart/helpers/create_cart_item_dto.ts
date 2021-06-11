import Joi from "joi"

export const validateCreateCartItemSchema = {
    product_id: Joi.number()
        .required(),
    quantity: Joi.number()
        .required()
}

export const validateCreateCartItemDto = Joi.object(validateCreateCartItemSchema)