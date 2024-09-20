const Order = require("../models/order.model");
const User = require("../models/user.model");
const Reserve = require("../models/reserve.model");
const TouristSpot = require("../models/tourists-spots.model");
const moment = require("moment");

exports.getOrders = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (!startDate || !endDate) {
      return res
        .status(400)
        .json({ message: "startDate and endDate are required" });
    }

    // Convert startDate and endDate to moment objects
    const start = moment(startDate).startOf("day");
    const end = moment(endDate).endOf("day");

    // Find orders within the specified date range
    const orders = await Order.find({
      createdAt: {
        $gte: start.toDate(),
        $lte: end.toDate(),
      },
    });

    // Create an array of dates for the specified range
    let formattedOrders = [];
    let currentDate = start.clone();
    const endDateMoment = end.clone();

    // Create a map to store order amounts by date
    const orderMap = {};
    orders.forEach((order) => {
      const orderDate = moment(order.createdAt).format("YYYY-MM-DD");
      orderMap[orderDate] = (orderMap[orderDate] || 0) + order.amount;
    });

    // Iterate through each date in the range and build the response
    while (currentDate.isSameOrBefore(endDateMoment)) {
      const dateStr = currentDate.format("YYYY-MM-DD");
      formattedOrders.push({
        name: dateStr,
        amt: orderMap[dateStr] || 0,
      });
      currentDate.add(1, "days");
    }

    return res.status(200).json({ orders: formattedOrders });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch orders" });
  }
};

exports.getReserves = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (!startDate || !endDate) {
      return res
        .status(400)
        .json({ message: "startDate and endDate are required" });
    }

    // reserving within the specified date range
    const reserves = await Reserve.find({
      createdAt: {
        $gte: new Date(startDate),
        $lt: new Date(endDate),
      },
    });

    return res.status(200).json({ data: reserves });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch reserves" });
  }
};

exports.getReservesByCategory = async (req, res) => {
  try {
    const { category } = req.query;
    const spots = await TouristSpot.find({ category });

    const reserves = await Reserve.find({
      touristSpot: { $in: spots.map((spot) => spot._id) },
    });

    return res.status(200).json({ reserves });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch reserves" });
  }
};

exports.getTotalEarnings = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const reserves = await Reserve.find({
      paid: true,
      createdAt: {
        $gte: new Date(startDate),
        $lt: new Date(endDate),
      },
    });

    const totalEarnings = reserves.reduce(
      (acc, reserve) => acc + reserve.totalPrice,
      0
    );

    return res.status(200).json({ totalEarnings });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch total earnings" });
  }
};
