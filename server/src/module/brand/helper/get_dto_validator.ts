import Joi from "joi"

export const validateGetBrandsDto = Joi.object({
    name: Joi.string(),
    limit: Joi.number(),
    offset: Joi.number()
})