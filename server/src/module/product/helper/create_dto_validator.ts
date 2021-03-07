import Joi from "joi"

export const validateCreateProductDto = Joi.object({
    id: Joi.number(),
    name: Joi.string()
        .min(3)
        .max(20)
        .required(),
    brand: Joi.string()
        .required(),
    image: Joi.string()
        .required(),
    description: Joi.string()
        .min(3)
        .max(20)
        .required(),
    price: Joi.number()
        .required(),
    stock: Joi.boolean()
        .required(),
})