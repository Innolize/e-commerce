import Joi from "joi"
import { Roles } from "../../../config/constants/roles"

export const validateCreateUserSchema = {
    mail: Joi.string()
        .min(3)
        .max(20)
        .required(),
    password: Joi.string()
        .min(3)
        .max(20)
        .required(),
    role: Joi.string()
        .valid(...Object.keys(Roles))
}

export const validateCreateUserDto = Joi.object(validateCreateUserSchema)