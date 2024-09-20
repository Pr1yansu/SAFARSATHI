const route = require("express").Router();
const passport = require("passport");
const {
  changePassword,
  deleteUser,
  forgotPassword,
  getAllUsers,
  getCurrentUser,
  getUserById,
  registerUser,
  resetPassword,
  updateUser,
  updateUserRole,
} = require("../controllers/users.controller");
const {
  adminMiddleware,
  authMiddleware,
} = require("../middleware/auth.middleware");

// Auth Routes
route.post("/login", (req, res) => {
  passport.authenticate("local", (err, user, options) => {
    if (user) {
      req.login(user, (error) => {
        if (error) {
          return res.status(500).json({ message: error });
        } else {
          return res
            .status(200)
            .json({ user: user, message: "Logged in successfully" });
        }
      });
    } else {
      return res.status(401).json({ message: options.message });
    }
  })(req, res);
});

route.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

route.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureMessage: "Cannot login to Google",
    failureRedirect: `${process.env.FRONTEND_URL}/login`,
    successRedirect: `${process.env.FRONTEND_URL}`,
    successMessage: "Logged in with Google",
  })
);

route.get(
  "/auth/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

route.get(
  "/auth/github/callback",
  passport.authenticate("github", {
    failureMessage: "Cannot login to Github",
    failureRedirect: `${process.env.FRONTEND_URL}/login`,
    successRedirect: `${process.env.FRONTEND_URL}`,
    successMessage: "Logged in with Github",
  })
);

route.get("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }

    req.session = null;
    req.user = null;

    return res.status(200).json({ message: "Logged out successfully" });
  });
});

// User Management Routes
route.get("/", authMiddleware, adminMiddleware, getAllUsers);
route.get("/:id", authMiddleware, adminMiddleware, getUserById);
route.put("/:id/update-role", authMiddleware, adminMiddleware, updateUserRole);
route.delete("/:id", authMiddleware, adminMiddleware, deleteUser);

route.put("/:id", authMiddleware, updateUser);
route.put("/:id/change-password", authMiddleware, changePassword);
route.get("/current/profile", authMiddleware, getCurrentUser);

// Registration and Password Management Routes
route.post("/register", registerUser);
route.post("/forgot-password", forgotPassword);
route.post("/reset-password", resetPassword);

module.exports = route;
