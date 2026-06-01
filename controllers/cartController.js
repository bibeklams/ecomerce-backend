import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import { throwError } from "../utils/errorHandler.js";

export const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;

    // 1. check product exists
    const product = await Product.findById(productId);
    if (!product) {
      return next(throwError("Product not found", 404));
    }

    // 2. find user's cart
    let cart = await Cart.findOne({ user: req.user.id });

    // 3. if cart doesn't exist, create new one
    if (!cart) {
      cart = new Cart({
        user: req.user.id,
        items: [],
        totalPrice: 0,
      });
    }

    // 4. check if product already exists in cart
    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId,
    );

    if (existingItem) {
      // update quantity
      existingItem.quantity += quantity;
    } else {
      // add new item
      cart.items.push({
        product: productId,
        quantity,
      });
    }

    // 5. calculate total price
    let total = 0;

    for (const item of cart.items) {
      const prod = await Product.findById(item.product);
      total += prod.price * item.quantity;
    }

    cart.totalPrice = total;

    // 6. save cart
    await cart.save();

    res.status(200).json({
      message: "Cart updated successfully",
      cart,
    });
  } catch (error) {
    next(error);
  }
};

export const getCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate(
      "items.product",
      "name price imageUrl",
    );
    if (!cart) {
      return next(throwError("Product not found", 404));
    }
    res.status(200).json({
      success: true,
      cart,
    });
  } catch (error) {
    next(error);
  }
};

export const updateCartQuantity = async (req, res, next) => {
  try {
    const { quantity } = req.body;
    const { productId } = req.params;

    // 1. find user's cart
    const cart = await Cart.findOne({
      user: req.user.id,
    });

    // 2. cart not found
    if (!cart) {
      return next(throwError("No cart found", 404));
    }

    // 3. find product inside cart
    const item = cart.items.find(
      (item) => item.product.toString() === productId,
    );

    // 4. item not found
    if (!item) {
      return next(throwError("Product not found in cart", 404));
    }

    // 5. update quantity
    item.quantity = quantity;

    // 6. recalculate total price
    let total = 0;

    for (const item of cart.items) {
      const product = await Product.findById(item.product);

      total += product.price * item.quantity;
    }

    cart.totalPrice = total;

    // 7. save cart
    await cart.save();

    // 8. response
    res.status(200).json({
      success: true,
      message: "Cart updated successfully",
      cart,
    });
  } catch (error) {
    next(error);
  }
};

export const removeFromCart = async (req, res, next) => {
  try {
    const { productId } = req.params;

    // 1. find cart
    const cart = await Cart.findOne({
      user: req.user.id,
    });

    // 2. cart not found
    if (!cart) {
      return next(throwError("No cart found", 404));
    }

    // 3. remove item
    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId,
    );

    // 4. recalculate total
    let total = 0;

    for (const item of cart.items) {
      const product = await Product.findById(item.product);

      total += product.price * item.quantity;
    }

    cart.totalPrice = total;

    // 5. save
    await cart.save();

    // 6. response
    res.status(200).json({
      success: true,
      message: "Removed successfully",
      cart,
    });
  } catch (error) {
    next(error);
  }
};

export const clearCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({
      user: req.user.id,
    });

    if (!cart) {
      return next(throwError("No cart found", 404));
    }

    // clear cart
    cart.items = [];
    cart.totalPrice = 0;

    await cart.save();

    res.status(200).json({
      success: true,
      message: "Cart cleared successfully",
      cart,
    });
  } catch (error) {
    next(error);
  }
};
