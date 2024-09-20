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
} = require("../controllers/tourist-spot.controllers");
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

module.exports = router;
