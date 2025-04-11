const verifyAuthor = async (req, res, next) => {
  try {
    if (req.user.role != "author") {
      return res
        .status(403)
        .json({ error: "Forbidden - User is not an author" });
    }

    next();
  } catch (error) {
    next(error);
  }
};

export default verifyAuthor;
