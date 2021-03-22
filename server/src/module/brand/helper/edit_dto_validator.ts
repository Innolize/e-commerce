import Joi from "joi"

export const validateEditBrandDto = Joi.object({
    id: Joi.number()
        .required(),
    name: Joi.string()
        .min(3)
        .max(20)
        .required()
})