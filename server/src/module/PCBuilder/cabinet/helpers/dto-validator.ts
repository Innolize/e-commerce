import Joi from "joi";
import { SIZE } from "../../../../config/constants/pcbuilder";
import { validateCreateProductSchema } from "../../../product/helper/create_dto_validator";


export const validateCabinetQuerySchema = Joi.object({
    limit: Joi.number(),
    offset: Joi.number(),
    size: Joi.any()
        .valid(...SIZE)
})

export const validateCabinetCreateSchema = {
    size: Joi.any()
        .valid(...SIZE)
        .required(),
    generic_pws: Joi.boolean()
        .required(),
    id_product: Joi.number()
        .required()
}

export const validateCabinetEditSchema = {
    size: Joi.any()
        .valid(...SIZE),
    id: Joi.number(),
    generic_pws: Joi.boolean()
}

export const validateCabinetAndProductDto = Joi.object({ ...validateCabinetCreateSchema, ...validateCreateProductSchema })
export const validateCabinetCreateDto = Joi.object(validateCabinetCreateSchema)
export const validateCabinetEditDto = Joi.object(validateCabinetEditSchema)