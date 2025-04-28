import { httpCodes, serverErrorCodes } from "../config/constants.js";

const responseHandler = (res, statusCode, message, data = {}, error = null) => {
  let status = statusCode === httpCodes.OK ? statusCode : httpCodes.BAD;
  if (serverErrorCodes.includes(statusCode)) {
    status = statusCode;
  }
  const response = { message, statusCode, data, error };
  return res.status(status).json(response);
};

export default responseHandler;
