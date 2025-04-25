import { httpCodes } from "./httpCodes.js";

const responseHandler = (res, statusCode, message, data = {}, error = null) => {
  const status = statusCode === httpCodes.OK ? statusCode : httpCodes.BAD;
  const response = { message, statusCode, data, error };
  return res.status(status).json(response);
};

export default responseHandler;
