const express = require("express");
const {
  authMiddleware,
  adminMiddleware,
} = require("../middleware/auth.middleware");
const {
  getOrders,
  getReservesByCategory,
  getReserves,
  getTotalEarnings,
} = require("../controllers/charts.controller");

const router = express.Router();

router.get("/orders", authMiddleware, adminMiddleware, getOrders);

router.get("/reserves", authMiddleware, adminMiddleware, getReserves);

router.get(
  "/reserves/category",
  authMiddleware,
  adminMiddleware,
  getReservesByCategory
);

router.get("/earnings", authMiddleware, adminMiddleware, getTotalEarnings);

module.exports = router;
