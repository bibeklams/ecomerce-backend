import express from "express";
import protect from "../middleware/protect.js";
import adminOnly from "../middleware/adminOnly.js";
import { adminDashboard } from "../controllers/adminDashboardController.js";

const router = express.Router();

router.get("/dashboard", protect, adminOnly, adminDashboard);

export default router;
