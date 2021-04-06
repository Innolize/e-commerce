import Joi from "joi";
import { validateCreateProductSchema } from "../../../product/helper/create_dto_validator";

const CPU_BRANDS_ENUM = ["INTEL", "AMD"]
const RAM_VERSION_ENUM = ["DDR1", "DDR2", "DDR3", "DDR4"]
const SIZE = ["ATX", "Micro-ATX", "Mini-ATX"]


export const validateEditMotherboardDto = Joi.object({
    id: Joi.number()
        .required,
    cpu_socket: Joi.string().
        required(),
    cpu_brand: Joi.any()
        .valid(...CPU_BRANDS_ENUM)
        .required(),
    ram_version: Joi.any()
        .valid(...RAM_VERSION_ENUM)
        .required(),
    min_frec: Joi.number()
        .required(),
    max_frec: Joi.number()
        .greater(Joi.ref('...min_frec'))
        .required(),
    video_socket: Joi.string().
        required(),
    model_size: Joi.any()
        .valid(...SIZE)
        .required(),
    watts: Joi.number()
        .required(),
    product_id: Joi.number()
        .required()
})

export const validateMotherboardCreateSchema = {
    cpu_socket: Joi.string().
        required(),
    cpu_brand: Joi.any()
        .valid(...CPU_BRANDS_ENUM)
        .required(),
    ram_version: Joi.any()
        .valid(...RAM_VERSION_ENUM)
        .required(),
    min_frec: Joi.number()
        .required(),
    max_frec: Joi.number()
        .greater(Joi.ref('min_frec'))
        .required(),
    video_socket: Joi.string().
        required(),
    model_size: Joi.any()
        .valid(...SIZE)
        .required(),
    watts: Joi.number()
        .required()
}

export const validateMotherboardEditSchema = {
    ...validateMotherboardCreateSchema,
    id: Joi.number().
        required(),
    product_id: Joi.number().
        required(),
}

export const validateQueryCpuBrand = (cpu_brand: string): string => {
    return Joi.attempt(cpu_brand, Joi.string().valid(...CPU_BRANDS_ENUM), 'cpu_brand')
}

export const validateMotherboardAndProductDto = Joi.object({ ...validateMotherboardCreateSchema, ...validateCreateProductSchema })
export const validateMotherboardCreateDto = Joi.object(validateMotherboardCreateSchema)
export const validateMotherboardEditDto = Joi.object(validateMotherboardEditSchema)