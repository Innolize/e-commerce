import Joi from "joi"

export const validateCreateUserSchema = {
    mail: Joi.string()
        .min(3)
        .max(20)
        .required(),
    password: Joi.string()
        .min(3)
        .max(20)
        .required(),
    role_id: Joi.number()
}

export const validateCreateUserDto = Joi.object(validateCreateUserSchema)