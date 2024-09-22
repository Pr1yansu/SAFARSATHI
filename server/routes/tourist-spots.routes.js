const router = require("express").Router();

const {
  createTouristSpot,
  verifyTouristSpot,
  getTouristSpots,
  getTouristSpotById,
  getTouristSpotByIds,
  currentUserListedHomes,
  addReview,
  updateReview,
  getReviewByTouristSpotAndUserId,
  sendVerificationRequestToAdmins,
} = require("../controllers/tourist-spot.controllers");
const rateLimit = require("express-rate-limit");
const {
  authMiddleware,
  adminMiddleware,
} = require("../middleware/auth.middleware");

router.post("/create", authMiddleware, createTouristSpot);

router.put("/verify/:id", authMiddleware, adminMiddleware, verifyTouristSpot);

router.get("/", getTouristSpots);

router.get("/spot/:id", getTouristSpotById);

router.post("/ids", getTouristSpotByIds);

router.get("/listed-homes", authMiddleware, currentUserListedHomes);

router.post("/review/:touristSpotId", authMiddleware, addReview);

router.put("/review/:touristSpotId/:reviewId", authMiddleware, updateReview);

router.get(
  "/review/:touristSpotId",
  authMiddleware,
  getReviewByTouristSpotAndUserId
);

const limiter = rateLimit({
  windowMs: 2 * 60 * 1000,
  max: 1,
  message: {
    error: "Too many requests. Please try again later.",
    statusCode: 429,
  },
  handler: (req, res) => {
    return res.status(429).json({
      success: false,
      message: `Too many requests. Please try again after 2 minutes.`,
    });
  },
});

router.get(
  "/send-verification-request/:id",
  authMiddleware,
  limiter,
  sendVerificationRequestToAdmins
);

module.exports = router;
