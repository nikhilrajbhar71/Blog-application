import responseHandler from "../utils/responseHandler.js";

const verifyAuthor = async (req, res, next) => {
  try {
    if (req.user.role != "author") {
      return responseHandler(
        res,
        401,
        "Unauthorized",
        {},
        "Forbidden - User is not an author"
      );
    }

    next();
  } catch (error) {
    next(error);
  }
};

export default verifyAuthor;
