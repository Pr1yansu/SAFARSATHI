const Reserve = require("../models/reserve.model");
const TouristSpot = require("../models/tourists-spots.model");
const User = require("../models/user.model");
const Order = require("../models/order.model");
const razorpay = require("razorpay");
const crypto = require("crypto");
const short = require("short-uuid");
const { sendMail } = require("../utils/mail.utils");

const successfulPaymentTemplate = async (name, amount, currency, email) => {
  try {
    const path = `${__dirname}/../templates/successful-payment.html`;
    const html = await readFileAsync(path, "utf-8");
    return html
      .replace(/{{ name }}/g, name)
      .replace(/{{ amount }}/g, amount)
      .replace(/{{ currency }}/g, currency)
      .replace(/{{ email }}/g, email);
  } catch (error) {
    logger.error("Error reading successful payment template:", error);
  }
};

const instance = new razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.reserveTouristSpot = async (req, res) => {
  try {
    const { touristSpot, startDate, endDate, price } = req.body;

    const spot = await TouristSpot.findById(touristSpot);
    if (!spot) {
      return res.status(400).json({ message: "Tourist spot not found" });
    }

    const isReserved = await Reserve.findOne({
      touristSpot: spot._id,
      startDate: { $lte: endDate },
      endDate: { $gte: startDate },
    });

    if (isReserved) {
      return res.status(400).json({ message: "Tourist spot already reserved" });
    }

    const user = await User.findById(req.user._id);
    const newStartDate = new Date(startDate);
    const newEndDate = new Date(endDate);

    // If dates are same then add 1 day to end date
    if (newStartDate.getTime() === newEndDate.getTime()) {
      newEndDate.setDate(newEndDate.getDate() + 1);
    }

    const reserve = await Reserve.create({
      touristSpot: spot._id,
      user: user._id,
      startDate: newStartDate,
      endDate: newEndDate,
      totalPrice: price,
    });

    return res.status(201).json({
      reserve,
      message: "Tourist spot reserved successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to reserve tourist spot" });
  }
};

exports.getReserves = async (req, res) => {
  try {
    const reserves = await Reserve.find({ user: req.user._id });
    return res.status(200).json({ reserves });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch reserves" });
  }
};

exports.getReserveByTouristSpot = async (req, res) => {
  try {
    const { id } = req.params;
    const reserve = await Reserve.findOne({
      touristSpot: id,
      user: req.user._id,
    });
    return res.status(200).json({ reserve });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch reserve" });
  }
};

exports.cancelReserve = async (req, res) => {
  try {
    const { id } = req.params;
    const reserve = await Reserve.findById(id);
    if (!reserve) {
      return res.status(400).json({ message: "Reserve not found" });
    }
    await Reserve.findByIdAndDelete(id);
    return res.status(200).json({ message: "Reserve cancelled successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to cancel reserve" });
  }
};

exports.createOrder = async (req, res) => {
  try {
    const { reserveId } = req.body;

    const reserve = await Reserve.findById(reserveId);
    if (!reserve) {
      return res.status(404).json({ message: "Reserve not found" });
    }

    const amount = Math.round(Number(reserve.totalPrice) * 100);
    const options = {
      amount,
      currency: "INR",
      receipt: short.generate(),
      payment_capture: 1,
    };

    const response = await instance.orders.create(options);
    if (!response) {
      throw new Error("Failed to create Razorpay order");
    }

    const order = await Order.create({
      reserveId: reserve._id,
      amount: reserve.totalPrice,
      currency: options.currency,
      receipt: response.receipt,
      order_id: response.id,
      razorpayOrderId: response.id,
      user: req.user._id,
      razorpaySignature: crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(`${response.id}|${response.receipt}`)
        .digest("hex"),
    });

    res.status(201).json({
      order,
      message: "Order created successfully",
      orderDetails: response,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to create order", error: error.message });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    const { orderId, paymentId } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(400).json({ message: "Order not found" });
    }

    order.payment_id = paymentId;
    order.status = "paid";
    await order.save();

    const reserve = await Reserve.findById(order.reserveId);
    reserve.paid = true;
    await reserve.save();

    const template = await successfulPaymentTemplate(
      user.name,
      user.email,
      order.amount,
      order.currency
    );

    await sendMail(
      req.user.email,
      "Payment Successful",
      "Your payment was successful",
      template
    );

    return res.status(200).json({
      order,
      message: "Payment verified successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Failed to verify payment" });
  }
};

exports.getOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);
    if (!order) {
      return res.status(400).json({ message: "Order not found" });
    }
    return res.status(200).json({ order });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch order" });
  }
};

exports.cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);
    if (!order) {
      return res.status(400).json({ message: "Order not found" });
    }
    order.status = "cancelled";
    await order.save();
    return res.status(200).json({ message: "Order cancelled successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to cancel order" });
  }
};

exports.completeOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);
    if (!order) {
      return res.status(400).json({ message: "Order not found" });
    }
    order.status = "completed";
    await order.save();
    return res.status(200).json({ message: "Order completed successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to complete order" });
  }
};
