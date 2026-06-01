import Cart from "../models/Cart.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import { throwError } from "../utils/errorHandler.js";

// Create Order
export const createOrder = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Find user cart
    const cart = await Cart.findOne({ user: userId }).populate("items.product");

    if (!cart || cart.items.length === 0) {
      throwError("Cart is empty", 400);
    }

    let totalPrice = 0;

    const orderItems = [];

    for (const item of cart.items) {
      const product = item.product;

      // Check stock
      if (item.quantity > product.stock) {
        throwError(
          `${product.title} only has ${product.stock} stock left`,
          400,
        );
      }

      // Create snapshot for order
      orderItems.push({
        productId: product._id,
        title: product.title,
        image: product.imageUrl,
        quantity: item.quantity,
        price: product.price,
      });

      // Calculate total
      totalPrice += product.price * item.quantity;

      // Reduce stock
      product.stock -= item.quantity;
      await product.save();
    }

    // Create order
    const order = await Order.create({
      user: userId,
      items: orderItems,
      totalPrice,
    });

    // Clear cart
    cart.items = [];
    await cart.save();

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    next(error);
  }
};

// Get My Orders
export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({
      user: req.user.id,
    });

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    next(error);
  }
};

// Get Single Order
export const getSingleOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return next(throwError("Order not found", 404));
    }

    // ownership check
    if (order.user.toString() !== req.user.id) {
      return next(throwError("Unauthorized", 403));
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    next(error);
  }
};

// Cancel Order
export const cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return next(throwError("Order not found", 404));
    }

    // ownership check
    if (order.user.toString() !== req.user.id) {
      return next(throwError("Unauthorized", 403));
    }

    order.status = "cancelled";

    await order.save();

    res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      order,
    });
  } catch (error) {
    next(error);
  }
};

// ADMIN - Get All Orders
export const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find().populate("user", "name email");

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    next(error);
  }
};

// ADMIN - Update Order Status
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return next(throwError("Order not found", 404));
    }

    order.status = status;

    await order.save();

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    next(error);
  }
};
