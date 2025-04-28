import { body, validationResult } from "express-validator";
import { throwValidationError } from "../throwValidationError.js";

export const validateUserRegister = [
  body("email").isEmail().withMessage("Invalid email format"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("name").trim().notEmpty().withMessage("name is required"),
  body("role")
    .isIn(["viewer", "author"])
    .withMessage("Role must be either 'viewer' or 'author'"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throwValidationError(res, errors);
    }
    next();
  },
];
