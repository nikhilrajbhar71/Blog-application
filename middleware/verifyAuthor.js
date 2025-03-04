const verifyAuthor = async (req, res, next) => {
  try {
    console.log(JSON.stringify(req.user));
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
