import Category from "../models/Category.js";
import { throwError } from "../utils/errorHandler.js";
import cloudinary from "../config/cloudinaryConfig.js";
import slugify from "slugify";

export const addCategory = async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!req.file) {
      throwError("Image required", 400);
    }

    const imagePath = req.file.path;
    const result = await cloudinary.uploader.upload(imagePath);

    const category = await Category.create({
      name,
      slug: slugify(name, {
        lower: true,
        trim: true,
      }),
      imageUrl: result.secure_url,
      publicId: result.public_id,
    });
    res.status(201).json({
      success: true,
      message: "Successfully created",
      category,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllCategory = async (req, res, next) => {
  try {
    const categories = await Category.find();
    if (categories.length === 0) {
      throwError("No category found", 404);
    }
    res.status(200).json({
      success: true,
      categories,
    });
  } catch (error) {
    next(error);
  }
};
export const getSingleCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      throwError("No data found", 404);
    }
    res.status(200).json({
      success: true,
      category,
    });
  } catch (error) {
    next(error);
  }
};
export const updateCategory = async (req, res, next) => {
  try {
    const { name } = req.body;

    const category = await Category.findById(req.params.id);

    if (!category) {
      throwError("Category not found", 404);
    }

    category.name = name ?? category.name;

    if (name) {
      category.slug = slugify(name, {
        lower: true,
        trim: true,
      });
    }

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);

      await cloudinary.uploader.destroy(category.publicId);

      category.imageUrl = result.secure_url;

      category.publicId = result.public_id;
    }

    await category.save();

    res.status(200).json({
      success: true,
      message: "Updated successfully",
      category,
    });
  } catch (error) {
    next(error);
  }
};
export const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      throwError("Category not found", 404);
    }

    await cloudinary.uploader.destroy(category.publicId);

    await category.deleteOne();

    res.status(200).json({
      success: true,
      message: "Deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
