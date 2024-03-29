import Joi from "joi";
import { VIDEO_CARD_VERSION } from "../../../../config/constants/pcbuilder";
import { validateCreateProductSchema } from "../../../product/helper/create_dto_validator";


export const validateVideoCardQuerySchema = Joi.object({
    limit: Joi.number(),
    offset: Joi.number(),
    version: Joi.any()
        .valid(...VIDEO_CARD_VERSION)
})

export const validateVideoCardCreateSchema = {
    version: Joi.any()
        .valid(...VIDEO_CARD_VERSION)
        .required(),
    memory: Joi.number()
        .required(),
    clock_speed: Joi.number()
        .required(),
    watts: Joi.number()
        .required()
}

export const validateVideoCardEditSchema = {
    version: Joi.any()
        .valid(...VIDEO_CARD_VERSION)
        .optional(),
    memory: Joi.number(),
    clock_speed: Joi.number(),
    watts: Joi.number()
}

export const validateVideoCardAndProductDto = Joi.object({ ...validateVideoCardCreateSchema, ...validateCreateProductSchema })
export const validateVideoCardCreateDto = Joi.object(validateVideoCardCreateSchema)
export const validateVideoCardEditDto = Joi.object(validateVideoCardEditSchema)