import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { throwError } from "../utils/errorHandler.js";
import crypto from "crypto";

/* ---------------- REGISTER ---------------- */
export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return throwError("User already exist", 400);
    }

    const hashed = await bcrypt.hash(password, 10);

    const data = await User.create({
      name,
      email,
      password: hashed,
    });

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        id: data._id,
        name: data.name,
        email: data.email,
        role: data.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

/* ---------------- LOGIN ---------------- */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return throwError("Invalid credentials", 401);
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return throwError("Invalid credentials", 401);
    }

    const accessToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT,
      { expiresIn: "30m" },
    );

    const refreshToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.REFRESH_SECRET,
      { expiresIn: "1d" },
    );

    // Access token cookie
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 30 * 60 * 1000,
    });

    // Refresh token cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};
//logout
export const logout = async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  });

  res.status(200).json({
    success: true,
    message: "Logout successful",
  });
};

/* ---------------- REFRESH TOKEN ---------------- */
export const refreshToken = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken;

    if (!token) {
      return throwError("No Token found", 403);
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.REFRESH_SECRET);
    } catch (err) {
      return throwError("Invalid refresh token", 401);
    }

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return throwError("User not found", 404);
    }

    const newAccessToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT,
      { expiresIn: "30m" },
    );

    res.status(200).json({
      success: true,
      accessToken: newAccessToken,
    });
  } catch (error) {
    next(error);
  }
};

/* ---------------- FORGOT PASSWORD ---------------- */
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(200).json({
        success: true,
        message: "If email exists, reset link sent",
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Reset password token generated",
      resetToken,
    });
  } catch (error) {
    next(error);
  }
};

/* ---------------- RESET PASSWORD ---------------- */
export const resetPassword = async (req, res, next) => {
  try {
    const { newPassword } = req.body;

    if (!newPassword) {
      return throwError("New password is required", 400);
    }

    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return throwError("Invalid or expired token", 400);
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Password reset successful",
    });
  } catch (error) {
    next(error);
  }
};

/* ---------------- UPDATE PROFILE ---------------- */
export const updateProfile = async (req, res, next) => {
  try {
    const { name, email } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return throwError("User not found", 404);
    }

    user.name = name ?? user.name;
    user.email = email ?? user.email;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Updated Successfully",
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    next(error);
  }
};

/* ---------------- CHANGE PASSWORD ---------------- */
export const passwordChange = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return throwError("No user found", 404);
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return throwError("Incorrect password", 400);
    }

    if (oldPassword === newPassword) {
      return throwError("New password cannot be same as old password", 400);
    }

    const hashed = await bcrypt.hash(newPassword, 10);

    user.password = hashed;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    next(error);
  }
};
export const getMe = (req, res) => {
  res.json({
    user: req.user,
  });
};
