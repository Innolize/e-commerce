import Joi from "joi"

export const validateEditProductDto = Joi.object({
    name: Joi.string()
        .min(3)
        .max(40),
    image: Joi.string(),
    description: Joi.string()
        .min(3)
        .max(100),
    price: Joi.number(),
    stock: Joi.boolean(),
    id_brand: Joi.number(),
    id_category: Joi.number()
})