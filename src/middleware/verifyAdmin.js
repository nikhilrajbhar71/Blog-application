import responseHandler from "../utils/responseHandler.js";

const verifyAdmin = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized - No User Found" });
    }

    if (req.user.role !== "admin") {
      return responseHandler(
        res,
        401,
        "Forbidden - You Do Not Have Admin Privileges"
      );
    }

    next();
  } catch (error) {
    next(error);
  }
};

export default verifyAdmin;
