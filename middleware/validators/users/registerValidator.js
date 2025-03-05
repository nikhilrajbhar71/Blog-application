import { body, validationResult } from "express-validator";

export const validateUserRegister = [
  body("email").isEmail().withMessage("Invalid email format"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("username").trim().notEmpty().withMessage("Username is required"),
  body("role")
    .isIn(["viewer", "author"])
    .withMessage("Role must be either 'viewer' or 'author'"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
