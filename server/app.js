const express = require("express");
const connectDB = require("./config/db.config");
const morgan = require("morgan");
const session = require("express-session");
const MongoDBStore = require("connect-mongo");
const { asyncErrorHandler, handleError } = require("./utils/error");
const cors = require("cors");
const passport = require("passport");
const fileUpload = require("express-fileupload");
const cookieParser = require("cookie-parser");
const {
  generateRandomTouristsSpots,
} = require("./controllers/tourist-spot.controllers.js");
const {
  generateCategories,
} = require("./controllers/categories.controller.js");

// Load env vars
require("dotenv").config({
  path: "./.env",
});

// Connect to database
connectDB();

// Initialize passport
require("./config/passport.config");

// Cloudinary config
require("./config/cloudinary.config");

// Route files

//  Initialize express
const app = express();

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Access-Control-Allow-Origin",
      "Access-Control-Allow-Headers",
    ],
  })
);

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
    limits: { fileSize: 10 * 1024 * 1024 },
  })
);
app.use((req, res, next) => {
  if (req.files && req.files.image.size > 10000000) {
    return res.status(400).json({
      success: false,
      message: "File size too large (max 10MB)",
    });
  }
  next();
});

// Session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new MongoDBStore({
      mongoUrl: process.env.MONGO_URI,
      dbName: process.env.MONGO_DB_NAME,
      ttl: 14 * 24 * 60 * 60,
    }),
    cookie: {
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      httpOnly: true,
    },
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Dev logging middleware
app.use(morgan("dev"));

// Mount routers
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

app.get(
  "/",
  asyncErrorHandler(async (req, res, next) => {
    return res.send("API is running on port 5000");
  })
);

// Mount routers
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

process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});

process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  process.exit(1);
});

// generateRandomTouristsSpots(10)
//   .then(() => {
//     console.log("Random tourist spots generated");
//   })
//   .catch((error) => {
//     console.log(error);
//   });

// generateCategories()
//   .then(() => {
//     console.log("Categories generated");
//   })
//   .catch((error) => {
//     console.log(error);
//   });
