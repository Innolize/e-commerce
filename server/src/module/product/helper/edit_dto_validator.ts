import Joi from "joi"

export const validateEditProductDto = Joi.object({
    id: Joi.number()
        .required(),
    name: Joi.string()
        .min(3)
        .max(40),
    brand: Joi.string(),
    image: Joi.string(),
    description: Joi.string()
        .min(3)
        .max(100),
    price: Joi.number(),
    stock: Joi.boolean(),
    id_category: Joi.number()
})