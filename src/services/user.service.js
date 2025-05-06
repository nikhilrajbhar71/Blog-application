import User from "../models/user.model.js";
import PasswordResetToken from "../models/passwordResetToken.model.js";
import AppError from "../utils/AppError.js";
import { Op } from "sequelize";
import bcrypt from "bcrypt";

export const findUserByEmail = async (email) => {
  return await User.findOne({ email });
};

export const createUser = async (name, email, password, role) => {
  const hashedPassword = await hashPassword(password);

  const user = new User({
    name,
    email,
    password: hashedPassword,
    role,
  });

  await user.save();
  user.password = undefined;

  return user;
};

export const findUserByPk = async (id) => {
  return await User.findById(id);
};

export const deleteUser = async (id) => {
  await User.findByIdAndDelete(id);
};

export const generateResetToken = async (email, token, expiresAt) => {
  const newToken = new PasswordResetToken({
    email,
    token,
    expiresAt,
  });

  await newToken.save();
  return newToken;
};

export const findResetToken = async (token) => {
  const tokenEntry = await PasswordResetToken.findOne({
    token,
    expiresAt: { $gt: new Date() },
  });

  if (!tokenEntry) {
    throw new AppError(401, "Invalid or expired token");
  }

  return tokenEntry;
};

export const hashPassword = async (password) => {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
};
