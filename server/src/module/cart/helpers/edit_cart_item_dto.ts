import Joi from "joi"

export const validateEditCartItemSchema = {
    quantity: Joi.number()
        .min(1)
        .required()
}

export const validateEditCartItemDto = Joi.object(validateEditCartItemSchema)