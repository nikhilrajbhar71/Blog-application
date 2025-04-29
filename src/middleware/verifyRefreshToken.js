import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import AppError from "../utils/AppError.js";
import responseHandler from "../utils/responseHandler.js";

const verifyRefreshToken = async (req, res, next) => {
  try {
    const authHeader = req.header("x-refresh-token");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return responseHandler(res, 401, "Unauthorized - No Token Provided", {});
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.REFRESH_SECRET);
    if (!decoded) {
      throw new AppError(401, "Forbidden - Invalid Token");
    }
    const user = await User.findById(decoded.userId);

    if (!user) {
      return responseHandler(res, 404, "User not found", {});
    }

    req.user = user;

    next();
  } catch (error) {
    next(error);
  }
};

export default verifyRefreshToken;
