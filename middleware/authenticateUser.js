import jwt from "jsonwebtoken";
import { getUserById } from "../models/userModel.js";

const authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ error: "Unauthorized - No Token Provided" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await getUserById(decoded.userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    console.log(JSON.stringify(user));

    req.user = user;

    next();
  } catch (error) {
    next(error);
  }
};

export default authenticateUser;
