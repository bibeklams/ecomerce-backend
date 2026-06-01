import Category from "../models/Category.js";
import Product from "../models/Product.js";
import User from "../models/User.js";
import { throwError } from "../utils/errorHandler.js";
import cloudinary from "../config/cloudinaryConfig.js";

export const addProduct = async (req, res, next) => {
  try {
    const { title, price, description, stock, brand, discount, category } =
      req.body;

    // Validate categoryId
    if (!category) {
      return next(throwError("CategoryId is required", 400));
    }

    // Check category exists
    const foundCategory = await Category.findById(category);

    if (!foundCategory) {
      return next(throwError("Category not found", 404));
    }

    // Check image exists
    if (!req.file) {
      return next(throwError("Product image is required", 400));
    }

    // Upload image
    const result = await cloudinary.uploader.upload(req.file.path);

    // Create product
    const product = await Product.create({
      title,
      price,
      description,
      stock,
      brand,
      discount,
      category: foundCategory._id,
      imageUrl: result.secure_url,
      publicId: result.public_id,
    });

    res.status(201).json({
      success: true,
      message: "Product added successfully",
      product,
    });
  } catch (error) {
    next(error);
  }
};
export const getAllProduct = async (req, res, next) => {
  try {
    const products = await Product.find()
      .populate("category", "name slug")
      .sort({ createdAt: -1 });
    if (products.length === 0) {
      return next(throwError("No product found", 404));
    }
    res.status(200).json({
      success: true,
      totalProducts: products.length,
      products,
    });
  } catch (error) {
    next(error);
  }
};

export const getSingleProduct = async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    throwError("No product found", 404);
  }
  res.status(200).json({
    success: true,
    product,
  });
};

export const updateProduct = async (req, res, next) => {
  try {
    const { title, price, description, stock, brand, discount, category } =
      req.body;

    // 1. Find product
    const product = await Product.findById(req.params.id);

    // 2. Check exists
    if (!product) {
      return next(throwError("Product not found", 404));
    }

    // 3. Update text fields safely
    product.title = title ?? product.title;
    product.price = price ?? product.price;
    product.description = description ?? product.description;
    product.stock = stock ?? product.stock;
    product.brand = brand ?? product.brand;
    product.discount = discount ?? product.discount;

    if (category) {
      const foundCategory = await Category.findById(category);
      if (!foundCategory) {
        return next(throwError("No cotegory found", 404));
      }
      product.category = foundCategory._id;
    }
    // 4. Only run image logic if new image exists
    if (req.file) {
      // upload new image
      const result = await cloudinary.uploader.upload(req.file.path);

      // delete old image
      await cloudinary.uploader.destroy(product.publicId);

      // update db image fields
      product.imageUrl = result.secure_url;
      product.publicId = result.public_id;
    }

    // 5. Save changes
    await product.save();

    res.status(200).json({
      success: true,
      message: "Updated successfully",
      product,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      throwError("No product found", 404);
    }
    await cloudinary.uploader.destroy(product.publicId);
    await product.deleteOne();
    res.status(200).json({
      success: true,
      message: "Deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const searchProduct = async (req, res, next) => {
  try {
    const { keyword } = req.query;

    const products = await Product.find({
      $or: [
        {
          title: {
            $regex: keyword,
            $options: "i",
          },
        },
        {
          description: {
            $regex: keyword,
            $options: "i",
          },
        },
        {
          brand: {
            $regex: keyword,
            $options: "i",
          },
        },
      ],
    })
      .populate("category")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    next(error);
  }
};
