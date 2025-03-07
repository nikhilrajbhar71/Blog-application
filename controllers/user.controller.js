import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import responseHandler from "../utils/responseHandler.js";
import emailSender from "../utils/emailSender.js";

export const userRegister = async (req, res, next) => {
  try {
    const { email, password, role, name } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    console.log("here");
    console.log("existingUser", JSON.stringify(existingUser));
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

    return responseHandler(res, 200, "User logged in  successfully", { token });
  } catch (error) {
    next(error);
  }
};
