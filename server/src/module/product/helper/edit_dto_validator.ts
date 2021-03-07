import Joi from "joi"

export const validateEditProductDto = Joi.object({
    id: Joi.number()
        .required(),
    name: Joi.string()
        .min(3)
        .max(20),
    brand: Joi.string(),
    image: Joi.string(),
    description: Joi.string()
        .min(3)
        .max(20),
    price: Joi.number(),
    stock: Joi.boolean(),
})