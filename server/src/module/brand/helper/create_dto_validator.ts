import Joi from "joi"

export const validateCreateBrandDto = Joi.object({
    name: Joi.string()
        .min(3)
        .max(20)
        .required(),
})