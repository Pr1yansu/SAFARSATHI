const express = require("express");
const router = express.Router();
const {
  cancelOrder,
  cancelReserve,
  completeOrder,
  createOrder,
  getOrder,
  getReserves,
  reserveTouristSpot,
  verifyPayment,
  getReserveByTouristSpot,
} = require("../controllers/reserve.controller");
const { authMiddleware } = require("../middleware/auth.middleware");

router.get("/orders/:id", authMiddleware, getOrder);
router.post("/order", authMiddleware, createOrder);
router.post("/order/verify", authMiddleware, verifyPayment);
router.put("/orders/cancel/:id", authMiddleware, cancelOrder);
router.put("/orders/complete/:id", authMiddleware, completeOrder);
router.get("/all", authMiddleware, getReserves);
router.post("/create", authMiddleware, reserveTouristSpot);
router.get("/tourist-spot/:id", authMiddleware, getReserveByTouristSpot);
router.put("/cancel/:id", authMiddleware, cancelReserve);

module.exports = router;
