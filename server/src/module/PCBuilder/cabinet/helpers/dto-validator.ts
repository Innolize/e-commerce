import Joi from "joi";
import { SIZE } from "../../../../config/constants/pcbuilder";
import { validateCreateProductSchema } from "../../../product/helper/create_dto_validator";


export const validateCabinetQuerySchema = Joi.object({
    size: Joi.any()
        .valid(...SIZE)
})

export const validateCabinetCreateSchema = {
    size: Joi.any()
        .valid(...SIZE)
        .required(),
    generic_pws: Joi.boolean()
}

export const validateCabinetEditSchema = {
    ...validateCabinetCreateSchema,
    id: Joi.number()
        .required,
    product_id: Joi.number()
        .required,
    generic_pws: Joi.boolean()
        .required()
}

export const validateCabinetAndProductDto = Joi.object({ ...validateCabinetCreateSchema, ...validateCreateProductSchema })
export const validateCabinetCreateDto = Joi.object(validateCabinetCreateSchema)
export const validateCabinetEditDto = Joi.object(validateCabinetEditSchema)