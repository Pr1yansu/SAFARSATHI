class ErrorHandler extends Error {
  constructor(statusCode, message) {
    super();
    this.statusCode = statusCode;
    this.message = message;
  }
}

const handleError = (err, res) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({ message });
};

const asyncErrorHandler = (fn) => {
  return function (req, res, next) {
    return fn(req, res, next).catch(next);
  };
};

const formatValidationErrors = (error) => {
  const errors = {};

  if (error.errors) {
    for (const key in error.errors) {
      if (error.errors[key].kind === "required") {
        errors[key] = `${key} is required`;
      } else {
        errors[key] = error.errors[key].message;
      }
    }
  }

  return errors;
};

module.exports = {
  ErrorHandler,
  handleError,
  asyncErrorHandler,
  formatValidationErrors,
};
