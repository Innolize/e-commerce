import Joi from "joi"
import { PAYMENT_STATUS } from "../../../config/constants/pcbuilder"

export const validateGetAllQueryPaymentSchema = {
    status: Joi.string().
        valid(...PAYMENT_STATUS),
    limit: Joi.number(),
    offset: Joi.number()
}

export const validateGetAllQueriesPaymentDto = Joi.object(validateGetAllQueryPaymentSchema)