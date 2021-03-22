import Joi from "joi"

export const validateEditCategoryDto = Joi.object({
    id: Joi.number()
        .required(),
    name: Joi.string()
        .min(3)
        .max(20)
        .required()
})