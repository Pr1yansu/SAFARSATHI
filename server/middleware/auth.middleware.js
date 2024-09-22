exports.authMiddleware = function (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  return res.status(401).json({
    message: "Please log in to access this resource",
  });
};

exports.adminMiddleware = function (req, res, next) {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      message: "You do not have permission to access this resource",
    });
  }

  return next();
};
