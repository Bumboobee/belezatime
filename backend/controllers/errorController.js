const sendError = (err, req, res) => {
  if (res.headersSent) {
    console.error("ERROR 💥 Headers already sent");
    return;
  }

  if (process.env.NODE_ENV === "production") {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      error: err,
      stack: err.stack,
    });
  }

  console.error("ERROR 💥");
  console.error(err.stack);
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (res.headersSent) {
    return next(err);
  }

  sendError(err, req, res);
};
