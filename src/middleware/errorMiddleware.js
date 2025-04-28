import { httpCodes } from "../utils/httpCodes.js";
import serverErrorCodes from "../utils/serverErrorCodes.js";
const errorMiddleware = (err, req, res, next) => {
  console.error("Error:", err.message || err);
  const message = err.message || "Internal Server Error";
  const statusCode = err.statusCode || 500;
  let status = statusCode === httpCodes.OK ? statusCode : httpCodes.BAD;
  if (serverErrorCodes.includes(statusCode)) {
    status = statusCode;
  }
  const response = {
    statusCode: statusCode,
    message,
    data: {},
    error: null,
  };

  res.status(status).json({ ...response });
};

export default errorMiddleware;
