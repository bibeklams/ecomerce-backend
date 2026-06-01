import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import errorMiddleware from "./middleware/errorMiddleware.js";

import adminDashboardRoutes from "./routes/adminDashboardRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import userRoutes from "./routes/userRoutes.js";

const app = express();
// middleware
app.use(express.json());
app.use(cookieParser());
app.use("/", (req, res, next) => {
  console.log("this is server");
  next();
});
console.log("server is running");

// health route
app.get("/", (req, res) => {
  res.json({
    message: "API is running",
  });
});

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

// routes
app.use("/api/admin", adminDashboardRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);

// global error middleware
app.use(errorMiddleware);

export default app;
