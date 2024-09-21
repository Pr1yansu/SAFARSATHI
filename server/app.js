// Load environment variables
require("dotenv").config({ path: "./.env" });

// Import required packages and modules
const express = require("express");
const morgan = require("morgan");
const session = require("express-session");
const MongoDBStore = require("connect-mongo");
const passport = require("passport");
const fileUpload = require("express-fileupload");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { asyncErrorHandler, handleError } = require("./utils/error");
const connectDB = require("./config/db.config");
const {
  generateRandomTouristsSpots,
} = require("./controllers/tourist-spot.controllers.js");
const {
  generateCategories,
} = require("./controllers/categories.controller.js");

// Connect to database
connectDB();

// Initialize passport configurations
require("./config/passport.config");

// Initialize Cloudinary configurations
require("./config/cloudinary.config");

// Initialize express application
const app = express();

// CORS setup with custom origin whitelist
app.use(
  cors({
    origin: function (origin, callback) {
      if (process.env.WHITELISTED_DOMAINS.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // Allow sending cookies and credentials
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Access-Control-Allow-Origin",
      "Access-Control-Allow-Headers",
    ],
  })
);

// Middleware setup
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data
app.use(cookieParser()); // Parse cookies

// File upload middleware configuration
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
    limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10MB
  })
);

// Custom file size error handling middleware
app.use((req, res, next) => {
  if (req.files && req.files.image.size > 10000000) {
    return res.status(400).json({
      success: false,
      message: "File size too large (max 10MB)",
    });
  }
  next();
});

// Session middleware configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET, // Secret for session encryption
    resave: false,
    saveUninitialized: true,
    store: new MongoDBStore({
      mongoUrl: process.env.MONGO_URI,
      dbName: process.env.MONGO_DB_NAME,
      ttl: 14 * 24 * 60 * 60, // Session expiry time (14 days)
    }),
    cookie: {
      secure: process.env.NODE_ENV === "production", // Secure cookie for production (HTTPS)
      sameSite: "none", // Allow cross-origin cookies
      httpOnly: true, // Ensure cookie is not accessible via client-side JavaScript
    },
  })
);

// Passport middleware for authentication
app.use(passport.initialize());
app.use(passport.session());

// Development logging middleware
app.use(morgan("dev"));

// Routes setup
app.get(
  "/",
  asyncErrorHandler(async (req, res, next) => {
    return res.send("API is running on port 5000");
  })
);

// Mounting all API route files
app.use("/api/v1/countries", require("./routes/countries.routes"));
app.use("/api/v1/users", require("./routes/users.routes"));
app.use("/api/v1/categories", require("./routes/categories.routes.js"));
app.use("/api/v1/tourist-spot", require("./routes/tourist-spots.routes.js"));
app.use("/api/v1/reserves", require("./routes/reserve.routes.js"));
app.use("/api/v1/charts", require("./routes/charts.routes.js"));

// Global error handler middleware
app.use((err, req, res, next) => {
  handleError(err, res);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  process.exit(1);
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
