import jwt from "jsonwebtoken";
import { getUserById } from "../models/userModel.js";
const protectRoute = async (req, res, next) => {
  try {
    const token = req.header("Authorization");

    if (!token) {
      return res
        .status(401)
        .json({ error: "Unauthorized - No Token Provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(401).json({ error: "Unauthorized - Invalid Token" });
    }
    if (decoded.role != "author") {
      return res
        .status(403)
        .json({ error: "Forbidden - User is not an author" });
    }
    // console.log("decoded: " + JSON.stringify(decoded));

    const user = await getUserById(decoded.userId);
    // console.log("user " + JSON.stringify(user));
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    req.user = user;

    // console.log("Author in protectRoute:", req.user);

    next();
  } catch (error) {
    console.log("Error in protectRoute middleware: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export default protectRoute;
