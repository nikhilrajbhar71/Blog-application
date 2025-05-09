import User from "../models/user.model.js";
import PasswordResetToken from "../models/passwordResetToken.model.js";
import AppError from "../utils/AppError.js";
import { Op } from "sequelize";
import bcrypt from "bcrypt";

export const findUserByEmail = async (email) => {
  const user = await User.findOne({ where: { email } });

  return user;
};

export const checkIfUserExists = async (email) => {
  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw new AppError(404, "user not found");
  }
};
export const createUser = async (name, email, password, role) => {
  const user = await User.create({
    name,
    email,
    password,
    role,
  });
  delete user.dataValues.password;
  return user;
};

export const findUserByPk = async (id) => {
  const user = await User.findByPk(id);

  return user;
};

export const deleteUser = async (id) => {
  await User.destroy({
    where: {
      id,
    },
  });
};

export const generateResetToken = async (email, token, expiresAt) => {
  const newToken = await PasswordResetToken.create({ email, token, expiresAt });

  return newToken;
};

export const findResetToken = async (token) => {
  const tokenEntry = await PasswordResetToken.findOne({
    where: {
      token,
      expiresAt: { [Op.gt]: new Date() },
    },
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
