import express from "express";
const router = express.Router();

import protect from "../middleware/protect.js";
import validate from "../middleware/validate.js";
import adminOnly from "../middleware/adminOnly.js";

import {
  createOrder,
  getMyOrders,
  getAllOrders,
  getSingleOrder,
  cancelOrder,
  updateOrderStatus,
} from "../controllers/orderController.js";

import {
  orderSchema,
  updateOrderSchema,
} from "../validation/orderValidation.js";

// create order
router.post("/", protect, validate(orderSchema), createOrder);

// my orders
router.get("/", protect, getMyOrders);

// single order
router.get("/:id", protect, getSingleOrder);

// cancel order
router.put("/:id/cancel", protect, cancelOrder);

// admin get all orders
router.get("/all", protect, adminOnly, getAllOrders);

// admin update order status
router.put(
  "/:id",
  protect,
  adminOnly,
  validate(updateOrderSchema),
  updateOrderStatus,
);

export default router;
