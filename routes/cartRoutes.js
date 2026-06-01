import express from "express";
const router = express.Router();

import protect from "../middleware/protect.js";
import validate from "../middleware/validate.js";

import {
  addToCart,
  getCart,
  updateCartQuantity,
  removeFromCart,
  clearCart,
} from "../controllers/cartController.js";

import {
  addToCartSchema,
  updateCartSchema,
} from "../validation/cartValidation.js";

// add item
router.post("/", protect, validate(addToCartSchema), addToCart);

// get my cart
router.get("/", protect, getCart);

// update quantity
router.put(
  "/:productId",
  protect,
  validate(updateCartSchema),
  updateCartQuantity,
);

// clear cart
router.delete("/clear", protect, clearCart);

// remove one product
router.delete("/:productId", protect, removeFromCart);

export default router;
