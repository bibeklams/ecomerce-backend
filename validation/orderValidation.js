import Joi from "joi";

export const orderSchema = Joi.object({
  items: Joi.array()
    .items(
      Joi.object({
        productId: Joi.string().required().messages({
          "any.required": "Product id is required",
        }),

        quantity: Joi.number().integer().min(1).required().messages({
          "number.min": "Quantity must be at least 1",
        }),
      }),
    )
    .min(1)
    .required()
    .messages({
      "array.min": "Order must contain at least one item",
    }),
});
export const updateOrderSchema = Joi.object({
  status: Joi.string()
    .valid("pending", "processing", "delivered", "cancelled")
    .required()
    .messages({
      "any.only": "Invalid order status",
      "any.required": "Order status is required",
    }),
});
