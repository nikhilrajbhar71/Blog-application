import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import AppError from "../utils/AppError.js";

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
    if (!decoded) {
      throw new AppError(403, "Forbidden - Invalid Token");
    }
    const user = await User.findByPk(decoded.userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    req.user = user;

    next();
  } catch (error) {
    next(error);
  }
};

export default authenticateUser;
