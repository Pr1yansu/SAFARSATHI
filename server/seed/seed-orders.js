const Order = require("../models/order.model");
const Reserve = require("../models/reserve.model");
const { log, pick } = require("./utils");
const short = require("short-uuid");

module.exports = async function seedOrders(count = 10) {
  const existing = await Order.countDocuments();
  if (existing > 0) {
    log(`Orders already exist (${existing}), skipping order seeding.`);
    const ids = await Order.find().distinct("_id");
    return { created: 0, orderIds: ids };
  }

  const paidReserves = await Reserve.find({ paid: true }).populate("user");
  if (!paidReserves.length) {
    log("No paid reserves available to create orders.");
    return { created: 0, orderIds: [] };
  }

  const orders = [];
  for (let i = 0; i < count; i++) {
    const reserve = pick(paidReserves);
    orders.push({
      razorpayOrderId: short.generate(),
      reserveId: reserve._id,
      user: reserve.user._id,
      amount: reserve.totalPrice,
      status: "paid",
      createdAt: new Date()
    });
  }

  const inserted = await Order.create(orders);
  log(`Inserted ${inserted.length} orders.`);
  return { created: inserted.length, orderIds: inserted.map(o => o._id) };
};
