import Joi from "joi";

export const validateGetProductDto = Joi.object({
    limit: Joi.number(),
    offset: Joi.number(),
    name: Joi.string(),
    category_id: Joi.number()
})