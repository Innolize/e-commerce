import Joi from "joi";
import { validateCreateProductSchema } from "../../../product/helper/create_dto_validator";


export const validateProcessorQuerySchema = Joi.object({
    limit: Joi.number(),
    offset: Joi.number(),
    socket: Joi.string()
        .required(),
})

export const validateProcessorCreateSchema = {
    cores: Joi.number()
        .required(),
    socket: Joi.string()
        .required(),
    frecuency: Joi.number()
        .required(),
    watts: Joi.number()
        .required()
}

export const validateProcessorEditSchema = {
    ...validateProcessorCreateSchema,
    id: Joi.number()
        .required,
    product_id: Joi.number()
        .required,
}

export const validateProcessorAndProductDto = Joi.object({ ...validateProcessorCreateSchema, ...validateCreateProductSchema })
export const validateProcessorCreateDto = Joi.object(validateProcessorCreateSchema)
export const validateProcessorEditDto = Joi.object(validateProcessorEditSchema)