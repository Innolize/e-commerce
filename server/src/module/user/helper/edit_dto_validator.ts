import Joi from "joi"
import { Roles } from "../../../config/constants/roles"

export const validateEditUserDto = Joi.object({
    id: Joi.number()
        .required(),
    mail: Joi.string()
        .min(3)
        .max(20),
    password: Joi.string(),
    role: Joi.string().valid(...Object.values(Roles))
})