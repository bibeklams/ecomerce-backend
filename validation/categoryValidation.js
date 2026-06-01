import Joi from "joi";

export const categorySchema = Joi.object({
  name: Joi.string().min(2).max(50).trim().required().messages({
    "string.empty": "Category name is required",
    "string.min": "Category name must be at least 2 characters",
    "string.max": "Category name cannot exceed 50 characters",
  }),
});

export const updateCategorySchema = Joi.object({
  name: Joi.string().min(2).max(50).trim().messages({
    "string.empty": "Category name is required",
    "string.min": "Category name must be at least 2 characters",
    "string.max": "Category name cannot exceed 50 characters",
  }),
});
