import express from "express";
import {
  getAllUser,
  getSingleUser,
  deleteUser,
} from "../controllers/UserController.js";
import protect from "../middleware/protect.js";
import adminOnly from "../middleware/adminOnly.js";
const router = express.Router();

router.get("/", protect, adminOnly, getAllUser);
router.get("/:id", protect, adminOnly, getSingleUser);
router.delete("/:id", protect, adminOnly, deleteUser);

export default router;
