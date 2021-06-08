import Joi from "joi";
import { RAM_VERSION } from "../../../../config/constants/pcbuilder";
import { validateCreateProductSchema } from "../../../product/helper/create_dto_validator";


export const validateRamQuerySchema = Joi.object({
    offset: Joi.number(),
    limit: Joi.number(),
    min_frec: Joi.number(),
    max_frec: Joi.number()
        .greater(Joi.ref('min_frec')),
    ram_version: Joi.any()
        .valid(...RAM_VERSION)
})

export const validateRamCreateSchema = {
    min_frec: Joi.number()
        .required(),
    max_frec: Joi.number()
        .greater(Joi.ref('min_frec'))
        .required(),
    memory: Joi.number()
        .required(),
    ram_version: Joi.any()
        .valid(...RAM_VERSION)
        .required(),
    watts: Joi.number()
        .required()
}

export const validateRamEditSchema = {
    ...validateRamCreateSchema,
    id: Joi.number()
        .required,
    product_id: Joi.number()
        .required,
}

export const validateRamAndProductDto = Joi.object({ ...validateRamCreateSchema, ...validateCreateProductSchema })
export const validateRamCreateDto = Joi.object(validateRamCreateSchema)
export const validateRamEditDto = Joi.object(validateRamEditSchema)