import Joi from "joi"

export const validateGetCartDto = Joi.object({
    limit: Joi.number(),
    offset: Joi.number()
})