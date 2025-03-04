import { createUser, getUserByEmail } from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import responseHandler from "../utils/responseHandler.js";

export const userRegister = async (req, res, next) => {
  try {
    const { email, password, role, username } = req.body;

    const [userFound] = await getUserByEmail(email);

    if (userFound.length > 0) {
      return responseHandler(res, 409, "Email already exists");
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = await createUser(username, email, hashedPassword, role);

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
    const [userFound] = await getUserByEmail(email);

    if (userFound.length == 0) {
      return responseHandler(
        response,
        404,
        "User doesn't exist, please sign up."
      );
    }
    console.log("user found " + JSON.stringify(userFound));
    const isVerified = await bcrypt.compare(password, userFound[0].password);
    if (!isVerified) {
      return responseHandler(res, 401, "Incorrect password");
    }

    const token = jwt.sign(
      {
        userId: userFound[0].id,
        email: userFound[0].email,
        role: userFound[0].role,
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
