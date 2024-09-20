const mongoose = require("mongoose");
const { CronJob } = require("cron");

const orderSchema = new mongoose.Schema({
  razorpayOrderId: {
    type: String,
    required: true,
  },
  razorpayPaymentId: {
    type: String,
  },
  razorpaySignature: {
    type: String,
  },
  reserveId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Reserve",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "cancelled", "paid"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Order = mongoose.model("Order", orderSchema);

const job = new CronJob("0 0 * * *", async () => {
  const orders = await Order.find({ status: "pending" });

  for (const order of orders) {
    if (new Date() > order.createdAt.setDate(order.createdAt.getDate() + 1)) {
      order.status = "cancelled";
      await order.save();
    }
  }
});

job.start();

module.exports = Order;
