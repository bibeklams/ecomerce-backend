import { throwError } from "../utils/errorHandler.js";
const adminOnly = (req, res, next) => {
  try {
    if (req.user.role !== "admin") {
      throwError("Admin only access denied", 403);
    }
    console.log(req.user.role);
    next();
  } catch (error) {
    next(error);
  }
};
export default adminOnly;
