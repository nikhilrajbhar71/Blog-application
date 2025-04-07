import { query, validationResult } from "express-validator";

function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}

export const validateGetAllposts = [
  query("limit")
    .isInt({ gt: 0 })
    .withMessage("limit must be a valid positive integer"),
  query("page")
    .isInt({ gt: 0 })
    .withMessage("page must be a valid positive integer"),

  handleValidationErrors,
];
