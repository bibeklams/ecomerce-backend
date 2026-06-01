import Joi from "joi";

export const registerSchema = Joi.object({
  name: Joi.string().min(4).required().trim(),

  email: Joi.string().email().trim().required().messages({
    "string.email": "Please enter valid email",
  }),

  password: Joi.string()
    .min(6)
    .max(30)
    .pattern(/[a-zA-Z0-9@$#!%*&]/)
    .required()
    .messages({
      "string.pattern.base":
        "Password must contain only letters, numbers and symbols",
    }),
});
export const loginSchema = Joi.object({
  email: Joi.string().email().required().trim().messages({
    "string.email": "Enter valid email",
  }),

  password: Joi.string().required().trim(),
});
export const changeProfileSchema = Joi.object({
  name: Joi.string().min(4).required().trim(),

  email: Joi.string().email().required().trim().messages({
    "string.email": "Enter valid email",
  }),
});
export const passwordChangeSchema = Joi.object({
  oldPassword: Joi.string().required(),

  newPassword: Joi.string()
    .min(6)
    .max(30)
    .pattern(/[a-zA-Z0-9@$#!%*&]/)
    .required()
    .messages({
      "string.pattern.base":
        "Password must contain letters, numbers or symbols",
    }),
});
