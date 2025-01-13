const sendResponse = ({
  res,
  statusCode,
  success,
  message,
  data = null,
  token = null,
}) => {
  res.status(statusCode).json({
    success,
    message,
    data,
    token,
  });
};

export { sendResponse };
