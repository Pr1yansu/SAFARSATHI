const express = require("express");
const router = express.Router();
const { generateItinerary } = require("../controllers/aiController");

router.post("/itinerary", generateItinerary);

module.exports = router;
