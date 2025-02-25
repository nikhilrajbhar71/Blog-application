import { createUser, getUserByEmail } from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const userRegister = async (req, res) => {
  try {
    const { email, password, role, username } = req.body;

    if (!email || !password || !role || !username) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const [userFound] = await getUserByEmail(email);

    if (userFound.length > 0) {
      return res.status(409).json({ message: "Email already exists" });
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
    res.status(201).json({ message: "User created successfully", user, token });
  } catch (error) {
    console.error("Error registering user: ", error);

    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ message: "Email already exists" });
    }

    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const [userFound] = await getUserByEmail(email);

    if (userFound.length == 0) {
      return res
        .status(409)
        .json({ message: "User doesn't exist, please sign up." });
    }
    console.log("user found " + JSON.stringify(userFound));
    const user = await bcrypt.compare(password, userFound[0].password);
    if (!user) {
      return res.status(401).json({ message: "Incorrect password" });
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

    res.status(200).json({
      message: "User logged in  successfully",
      token,
    });
  } catch (error) {
    console.error("Error registering user: ", error);

    res.status(500).json({ message: "Internal Server Error" });
  }
};
