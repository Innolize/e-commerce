import Joi from "joi";

export const validateGetUsersDto = Joi.object({
    limit: Joi.number(),
    offset: Joi.number()
})