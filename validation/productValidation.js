import Joi from "joi";

export const productSchema = Joi.object({
  title: Joi.string().min(3).max(100).trim().required(),

  description: Joi.string().min(3).trim().required(),

  price: Joi.number().min(0).required(),

  stock: Joi.number().min(0).required(),

  category: Joi.string().required(),

  brand: Joi.string().trim().required(),

  discount: Joi.number().min(0).max(100).default(0),

  isFeatured: Joi.boolean().default(false),

  isActive: Joi.boolean().default(true),
});
export const updateProductSchema = Joi.object({
  title: Joi.string(),
  price: Joi.number(),
  description: Joi.string(),
  stock: Joi.number(),
  quantity: Joi.number(),
  brand: Joi.string(),
  discount: Joi.number(),
  category: Joi.string(),
});
