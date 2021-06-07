import Joi from "joi";
import { DISK_TYPE } from "../../../../config/constants/pcbuilder";
import { validateCreateProductSchema } from "../../../product/helper/create_dto_validator";


export const validateRamQuerySchema = Joi.object({
    type: Joi.string()
        .valid(...DISK_TYPE)
        .required()
})

export const validateRamCreateSchema = {
    total_storage: Joi.number()
        .required(),
    type: Joi.string()
        .valid(...DISK_TYPE)
        .required(),
    mbs: Joi.number()
        .required(),
    watts: Joi.number()
        .required()
}

export const validateRamEditSchema = {
    ...validateRamCreateSchema,
    id: Joi.number()
        .required
}

export const validateRamAndProductDto = Joi.object({ ...validateRamCreateSchema, ...validateCreateProductSchema })
export const validateRamCreateDto = Joi.object(validateRamCreateSchema)
export const validateRamEditDto = Joi.object(validateRamEditSchema)