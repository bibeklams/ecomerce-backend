import Joi from "joi";

export const addToCartSchema = Joi.object({
  productId: Joi.string().hex().length(24).required(),

  quantity: Joi.number().min(1).max(100).required(),
});
export const updateCartSchema = Joi.object({
  quantity: Joi.number().min(1).max(100).required().messages({
    "number.min": "Quantity must be at least 1",
    "number.max": "Quantity cannot exceed 100",
    "any.required": "Quantity is required",
  }),
});
