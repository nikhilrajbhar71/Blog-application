import { httpCodes } from "../utils/httpCodes.js";

const errorMiddleware = (err, req, res, next) => {
  console.error("Error:", err.message || err);
  const message = err.message || "Internal Server Error";
  const statusCode = err.statusCode || 500;
  const status = statusCode === httpCodes.OK ? statusCode : httpCodes.BAD;
  const response = {
    statusCode: statusCode,
    message,
    data: {},
    error: null,
  };

  res.status(status).json({ ...response });
};

export default errorMiddleware;
