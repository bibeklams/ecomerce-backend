import express from "express";
const router = express.Router();

import {
  categorySchema,
  updateCategorySchema,
} from "../validation/categoryValidation.js";

import adminOnly from "../middleware/adminOnly.js";
import protect from "../middleware/protect.js";
import validate from "../middleware/validate.js";
import upload from "../middleware/uploadmiddleware.js";

import {
  addCategory,
  deleteCategory,
  getAllCategory,
  getSingleCategory,
  updateCategory,
} from "../controllers/categoryController.js";

router.post(
  "/",
  protect,
  adminOnly,
  upload.single("image"),
  validate(categorySchema),
  addCategory,
);

router.get("/", getAllCategory);

router.get("/:id", getSingleCategory);

router.put(
  "/:id",
  protect,
  adminOnly,
  upload.single("image"),
  validate(updateCategorySchema),
  updateCategory,
);

router.delete("/:id", protect, adminOnly, deleteCategory);

export default router;
