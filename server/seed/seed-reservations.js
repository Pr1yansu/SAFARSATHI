const Reserve = require("../models/reserve.model");
const TouristSpot = require("../models/tourists-spots.model");
const User = require("../models/user.model");
const { faker } = require("@faker-js/faker");
const { log, randInt, pick } = require("./utils");

module.exports = async function seedReservations(count = 15) {
  const existing = await Reserve.countDocuments();
  if (existing > 0) {
    log(`Reservations already exist (${existing}), skipping reservation seeding.`);
    const ids = await Reserve.find().distinct("_id");
    return { created: 0, reservationIds: ids };
  }

  const spots = await TouristSpot.find();
  const users = await User.find({ role: "user" });
  if (!spots.length || !users.length) {
    log("Cannot seed reservations: need tourist spots and users.");
    return { created: 0, reservationIds: [] };
  }

  const reserves = [];
  for (let i = 0; i < count; i++) {
    const spot = pick(spots);
    const user = pick(users);
    const startDate = faker.date.soon({ days: 30 });
    const nights = randInt(1, 7);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + nights);
    const totalPrice = nights * spot.price;
    reserves.push({
      touristSpot: spot._id,
      user: user._id,
      startDate,
      endDate,
      totalPrice: Math.round(totalPrice),
      paid: randInt(0, 1) === 1,
    });
  }

  const inserted = await Reserve.create(reserves);
  log(`Inserted ${inserted.length} reservations.`);
  return { created: inserted.length, reservationIds: inserted.map(r => r._id) };
};
