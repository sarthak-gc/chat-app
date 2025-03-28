const loggerMiddleware = (req, res, next) => {
  const ipAddress = req.ip;
  const method = req.method;
  const route = req.originalUrl;

  console.log(
    `[${new Date().toLocaleDateString()}] / ${new Date().toLocaleTimeString()} : ${ipAddress} - ${method} ${route}`
  );

  next();
};
export default loggerMiddleware;
