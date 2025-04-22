import bcrypt from "bcrypt";
import crypto from "crypto";

import responseHandler from "../utils/responseHandler.js";
import { jwtSignHelper } from "../utils/jwtSignHelper.js";
import {
  createUser,
  deleteUser,
  findResetToken,
  findUserByEmail,
  findUserByPk,
  generateResetToken,
  hashPassword,
} from "../services/user.service.js";
import User from "../models/user.model.js";
import { sendResetEmail } from "../utils/sendResetEmail.js";
import PasswordResetToken from "../models/passwordResetToken.model.js";

export const userRegister = async (req, res, next) => {
  try {
    const { email, password, role, name } = req.body;

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return responseHandler(res, 409, "Email already exists");
    }

    const hashedPassword = await hashPassword(password);

    const user = await createUser(name, email, hashedPassword, role);

    return responseHandler(res, 201, "User registered successfully", {
      user,
    });
  } catch (error) {
    next(error);
  }
};

export const userLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await findUserByEmail(email);
    if (!user) {
      return responseHandler(res, 404, "User doesn't exist, please sign up.");
    }

    const isVerified = await bcrypt.compare(password, user.password);
    if (!isVerified) {
      return responseHandler(res, 401, "Incorrect username or password");
    }

    const accessToken = jwtSignHelper(user, "1h", process.env.JWT_SECRET);
    const refreshToken = jwtSignHelper(user, "7d", process.env.REFRESH_SECRET);

    return responseHandler(res, 200, "User logged in  successfully", {
      id: user.id,
      name: user.name,
      email: user.email,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (req, res, next) => {
  try {
    const accesstoken = jwtSignHelper(req.user, "1h", process.env.JWT_SECRET);
    const refreshToken = jwtSignHelper(
      req.user,
      "7d",
      process.env.REFRESH_SECRET
    );

    return responseHandler(res, 200, "Token refreshed successfully", {
      accesstoken,
      refreshToken,
    });
  } catch (error) {
    next(error);
  }
};

export const getUserProfile = async (req, res, next) => {
  try {
    const user = await findUserByPk(req.params.id);
    if (!user) {
      return responseHandler(res, 404, "user not found", {});
    }
    return responseHandler(res, 200, "User profile fetched successfully", user);
  } catch (error) {
    next(error);
  }
};

export const deleteUserProfile = async (req, res, next) => {
  try {
    await deleteUser(req.user.id);
    return responseHandler(res, 200, "User profile deleted successfully", {});
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    await findUserByEmail(email);

    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 3600000);

    await generateResetToken(email, token, expiresAt);

    await sendResetEmail(email, token);

    responseHandler(res, 401, "created reset token", {});
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    const tokenEntry = await findResetToken(token);

    const user = await findUserByEmail(tokenEntry.email);

    user.password = await hashPassword(newPassword);
    await user.save();

    await PasswordResetToken.destroy({ where: { token } });

    return responseHandler(res, 200, "Password changed successfully", {});
  } catch (error) {
    next(error);
  }
};
