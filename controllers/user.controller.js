import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import responseHandler from "../utils/responseHandler.js";

export const userRegister = async (req, res, next) => {
  try {
    const { email, password, role, name } = req.body;

    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      return responseHandler(res, 409, "Email already exists");
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );
    const Refreshtoken = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.REFRESH_SECRET,
      {
        expiresIn: "7d",
      }
    );
    res.cookie("refreshToken", Refreshtoken, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return responseHandler(res, 201, "User created successfully", {
      user,
      token,
    });
  } catch (error) {
    next(error);
  }
};

export const userLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return responseHandler(res, 404, "User doesn't exist, please sign up.");
    }

    // await emailSender(email, "Login", "You've been logged in");

    const isVerified = await bcrypt.compare(password, user.password);
    if (!isVerified) {
      return responseHandler(res, 401, "Incorrect password");
    }

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );
    const Refreshtoken = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.REFRESH_SECRET,
      {
        expiresIn: "7d",
      }
    );
    res.cookie("refreshToken", Refreshtoken, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return responseHandler(res, 200, "User logged in  successfully", { token });
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    console.log("cookie token" + JSON.stringify(refreshToken));
    if (!refreshToken) {
      return responseHandler(res, 401, "Unauthorized, no refresh token found");
    }

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
    if (!decoded) {
      throw new AppError(403, "Forbidden - Invalid Token");
    }
    const user = await User.findByPk(decoded.userId);
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    return responseHandler(res, 200, "Token refreshed successfully", {
      token,
    });
  } catch (error) {
    next(error);
  }
};
