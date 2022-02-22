const requestLogger = (req, res, next) => {
  console.log(req.method, req.url, req.body);
  next();
};

module.exports = requestLogger;
