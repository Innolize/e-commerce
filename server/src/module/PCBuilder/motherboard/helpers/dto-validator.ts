import Joi from "joi";
import { CPU_BRANDS, RAM_VERSION, SIZE, VIDEO_CARD_VERSION } from "../../../../config/constants/pcbuilder";
import { validateCreateProductSchema } from "../../../product/helper/create_dto_validator";

export const validateMotherboardEditSchema = {
    cpu_socket: Joi.string(),
    cpu_brand: Joi.any()
        .valid(...CPU_BRANDS),
    ram_version: Joi.any()
        .valid(...RAM_VERSION),
    min_frec: Joi.number(),
    max_frec: Joi.number()
        .greater(Joi.ref('...min_frec')),
    video_socket: Joi.any()
        .valid(...VIDEO_CARD_VERSION),
    model_size: Joi.any()
        .valid(...SIZE),
    watts: Joi.number()
}

export const validateMotherboardCreateSchema = {
    cpu_socket: Joi.string().
        required(),
    cpu_brand: Joi.any()
        .valid(...CPU_BRANDS)
        .required(),
    ram_version: Joi.any()
        .valid(...RAM_VERSION)
        .required(),
    min_frec: Joi.number()
        .required(),
    max_frec: Joi.number()
        .greater(Joi.ref('min_frec'))
        .required(),
    video_socket: Joi.any()
        .valid(...VIDEO_CARD_VERSION)
        .required(),
    model_size: Joi.any()
        .valid(...SIZE)
        .required(),
    watts: Joi.number()
        .required()
}

export const validateMotherboardQuerySchema = Joi.object({
    limit: Joi.number(),
    offset: Joi.number(),
    cpu_brand: Joi.string()
        .valid(...CPU_BRANDS)
})

export const validateMotherboardAndProductDto = Joi.object({ ...validateMotherboardCreateSchema, ...validateCreateProductSchema })
export const validateMotherboardCreateDto = Joi.object(validateMotherboardCreateSchema)
export const validateMotherboardEditDto = Joi.object(validateMotherboardEditSchema)