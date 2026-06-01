import Joi from "joi";

export const addressSchema = Joi.object({
  fullName: Joi.string().min(3).max(50).trim().required(),

  street: Joi.string().min(3).max(100).trim().required(),

  city: Joi.string().min(2).max(50).trim().required(),

  wardNo: Joi.number().min(1).required(),

  country: Joi.string().min(2).max(50).trim().required(),

  phoneNo: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .required()
    .messages({
      "string.pattern.base": "Phone number must be 10 digits",
    }),
});
