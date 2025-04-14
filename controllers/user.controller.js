import bcrypt from "bcrypt";
import responseHandler from "../utils/responseHandler.js";
import { jwtSignHelper } from "../utils/jwtSignHelper.js";
import {
  createUser,
  deleteUser,
  findUserByEmail,
  findUserByPk,
} from "../services/user.service.js";

export const userRegister = async (req, res, next) => {
  try {
    const { email, password, role, name } = req.body;

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return responseHandler(res, 409, "Email already exists");
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

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
