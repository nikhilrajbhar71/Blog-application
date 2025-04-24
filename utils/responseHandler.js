const responseHandler = (res, statusCode, message, data = {}) => {
  const response = { message, data };
  return res.status(statusCode).json(response);
};

export default responseHandler;
