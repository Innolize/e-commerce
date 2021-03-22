import Joi from "joi"

export const validateCreateCategoryDto = Joi.object({
    name: Joi.string()
        .min(3)
        .max(20)
        .required(),
})