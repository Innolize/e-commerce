import Joi from "joi";
import { DISK_TYPE } from "../../../../config/constants/pcbuilder";
import { validateCreateProductSchema } from "../../../product/helper/create_dto_validator";


export const validateDiskStorageQuerySchema = Joi.object({
    limit: Joi.number(),
    offset: Joi.number(),
    type: Joi.string()
        .valid(...DISK_TYPE)
})

export const validateDiskStorageCreateSchema = {
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

export const validateDiskStorageEditSchema = {
    ...validateDiskStorageCreateSchema,
    id: Joi.number()
        .required
}

export const validateDiskStorageAndProductDto = Joi.object({ ...validateDiskStorageCreateSchema, ...validateCreateProductSchema })
export const validateDiskStorageCreateDto = Joi.object(validateDiskStorageCreateSchema)
export const validateDiskStorageEditDto = Joi.object(validateDiskStorageEditSchema)