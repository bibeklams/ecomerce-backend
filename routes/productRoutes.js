import express from "express";
import protect from "../middleware/protect.js";
import adminOnly from "../middleware/adminOnly.js";
import validate from "../middleware/validate.js";
import upload from "../middleware/uploadmiddleware.js";

import {
  productSchema,
  updateProductSchema,
} from "../validation/productValidation.js";

import {
  addProduct,
  getAllProduct,
  getSingleProduct,
  deleteProduct,
  updateProduct,
  searchProduct,
} from "../controllers/productController.js";

const router = express.Router();

router.post(
  "/",
  protect,
  adminOnly,
  upload.single("image"),
  validate(productSchema),
  addProduct,
);

router.get("/", getAllProduct);
router.get("/search", searchProduct);
router.get("/:id", getSingleProduct);

router.put(
  "/:id",
  protect,
  adminOnly,
  upload.single("image"),
  validate(updateProductSchema),
  updateProduct,
);

router.delete("/:id", protect, adminOnly, deleteProduct);

export default router;
