import Joi from "joi"

export const validateCreateProductSchema = {
    name: Joi.string()
        .max(40)
        .min(3)
        .required(),
    id_brand: Joi.number()
        .required(),
    description: Joi.string()
        .min(3)
        .max(100)
        .required(),
    price: Joi.number()
        .required(),
    stock: Joi.boolean()
        .required(),
    id_category: Joi.number()
        .required()
}

export const validateCreateProductDto = Joi.object(validateCreateProductSchema)