import express from "express";
import protect from "../middleware/protect.js";
import validate from "../middleware/validate.js";

import {
  registerSchema,
  loginSchema,
  changeProfileSchema,
  passwordChangeSchema,
} from "../validation/formValidation.js";

import {
  register,
  login,
  logout,
  forgotPassword,
  updateProfile,
  resetPassword,
  passwordChange,
  refreshToken,
  getMe,
} from "../controllers/authController.js";

const router = express.Router();

router.get("/me", protect, getMe);
router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/logout", logout);
router.post("/refresh-token", refreshToken);

router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:token", resetPassword);

router.put("/profile", protect, validate(changeProfileSchema), updateProfile);

router.put(
  "/change-password",
  protect,
  validate(passwordChangeSchema),
  passwordChange,
);

export default router;
