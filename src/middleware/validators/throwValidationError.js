import responseHandler from "../../utils/responseHandler.js";

export const throwValidationError = (res, errors) => {
  return responseHandler(res, 400, "Validation error", {}, errors.array());
};
