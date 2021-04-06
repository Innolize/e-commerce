import Joi from "joi";
import { RAM_VERSION } from "../../../../config/constants/pcbuilder";


export const validateRamQuerySchema = Joi.object({
    min_frec: Joi.number(),
    max_frec: Joi.number()
        .greater(Joi.ref('min_frec')),
    ram_version: Joi.any()
        .valid(...RAM_VERSION)
})