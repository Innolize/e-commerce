import Joi from "joi";
import { RAM_VERSION, VIDEO_CARD_VERSION } from "../../../../config/constants/pcbuilder";
import { validateCreateProductSchema } from "../../../product/helper/create_dto_validator";


export const validateVideoCardQuerySchema = Joi.object({
    min_frec: Joi.number(),
    max_frec: Joi.number()
        .greater(Joi.ref('min_frec')),
    ram_version: Joi.any()
        .valid(...RAM_VERSION)
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
    ...validateVideoCardCreateSchema,
    id: Joi.number()
        .required,
    product_id: Joi.number()
        .required,
}

export const validateVideoCardAndProductDto = Joi.object({ ...validateVideoCardCreateSchema, ...validateCreateProductSchema })
export const validateVideoCardCreateDto = Joi.object(validateVideoCardCreateSchema)
export const validateVideoCardEditDto = Joi.object(validateVideoCardEditSchema)