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
    console.log("decoded: " + JSON.stringify(decoded));
    // Check if the user is an employee or a normal user
    let user;
    user = await getUserById(decoded.userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    req.user = user;

    console.log("User in protectRoute:", req.user);

    next();
  } catch (error) {
    //console.log("Error in protectRoute middleware: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export default protectRoute;
