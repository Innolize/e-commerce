import Joi from "joi"
import { PAYMENT_TYPE } from "../../../config/constants/pcbuilder"

export const validateCreateOrderSchema = {
    paymentType: Joi.string()
        .valid(...PAYMENT_TYPE)
        .required()
}

export const validateCreateOrderDto = Joi.object(validateCreateOrderSchema)