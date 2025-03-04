import { param, validationResult } from "express-validator";

function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}

export const validateGetPost = [
  param("id")
    .isInt({ gt: 0 })
    .withMessage("Post ID must be a valid positive integer"),

  handleValidationErrors,
];
