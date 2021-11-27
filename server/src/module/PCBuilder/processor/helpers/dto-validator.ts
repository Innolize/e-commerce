import Joi from "joi";
import { validateCreateProductSchema } from "../../../product/helper/create_dto_validator";


export const validateProcessorQuerySchema = Joi.object({
    limit: Joi.number(),
    offset: Joi.number(),
    socket: Joi.string()
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
    cores: Joi.number(),
    socket: Joi.string(),
    frecuency: Joi.number(),
    watts: Joi.number()
}

export const validateProcessorAndProductDto = Joi.object({ ...validateProcessorCreateSchema, ...validateCreateProductSchema })
export const validateProcessorCreateDto = Joi.object(validateProcessorCreateSchema)
export const validateProcessorEditDto = Joi.object(validateProcessorEditSchema)