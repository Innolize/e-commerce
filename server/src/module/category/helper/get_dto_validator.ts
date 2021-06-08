import Joi from "joi"

export const validateGetCategoriesDto = Joi.object({
    name: Joi.string(),
    limit: Joi.number(),
    offset: Joi.number()
})