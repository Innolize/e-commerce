import Joi from "joi";
import { PWS_CERTIFICATION, } from "../../../../config/constants/pcbuilder";
import { validateCreateProductSchema } from "../../../product/helper/create_dto_validator";


export const validatePowerSupplyQuerySchema = Joi.object({
    limit: Joi.number(),
    offset: Joi.number(),
    watts: Joi.number()
})

export const validatePowerSupplyCreateSchema = {
    watts: Joi.number()
        .required(),
    certification: Joi.string()
        .valid(...PWS_CERTIFICATION)
        .required()
}

export const validatePowerSupplyEditSchema = {
    watts: Joi.number(),
    certification: Joi.string()
        .valid(...PWS_CERTIFICATION)
        .optional()
}

export const validatePowerSupplyAndProductDto = Joi.object({ ...validatePowerSupplyCreateSchema, ...validateCreateProductSchema })
export const validatePowerSupplyCreateDto = Joi.object(validatePowerSupplyCreateSchema)
export const validatePowerSupplyEditDto = Joi.object(validatePowerSupplyEditSchema)