import Joi from "joi"

export const validateGetCartDto = Joi.object({
    userId: Joi.number(),
    limit: Joi.number(),
    offset: Joi.number()
})