import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { throwError } from "../utils/errorHandler.js";

const protect = async (req, res, next) => {
  try {
    let token;

    // 1. Try Authorization header
    const authHeader = req.headers.authorization;

    if (authHeader?.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    // 2. Try cookie (frontend refresh flow)
    if (!token) {
      token = req.cookies.accessToken;
    }

    // 3. No token
    if (!token) {
      throwError("No token found", 401);
    }

    // 4. Verify token
    const decoded = jwt.verify(token, process.env.JWT);

    // 5. Get user
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      throwError("User not found", 404);
    }

    // 6. Attach user
    req.user = user;

    next();
  } catch (error) {
    next(error);
  }
};

export default protect;
