require("dotenv").config({ path: "./.env" });
const mongoose = require("mongoose");
const { connect, log, writeCsvSummary } = require("./utils");

// Individual seeders
const seedUsers = require("./seed-users");
const seedCategories = require("./seed-categories");
const seedTouristSpots = require("./seed-tourist-spots");
const seedReservations = require("./seed-reservations");
const seedOrders = require("./seed-orders");
const seedNewsletter = require("./seed-newsletter");

// Allow overriding counts via env vars
const COUNTS = {
  USERS: parseInt(process.env.SEED_USERS || "8", 10),
  TOURIST_SPOTS: parseInt(process.env.SEED_TOURIST_SPOTS || "20", 10),
  RESERVATIONS: parseInt(process.env.SEED_RESERVATIONS || "15", 10),
  ORDERS: parseInt(process.env.SEED_ORDERS || "10", 10),
  NEWSLETTER: parseInt(process.env.SEED_NEWSLETTER || "12", 10)
};

async function run() {
  const start = Date.now();
  await connect();
  log("Connected to MongoDB.");

  // Always clear the entire database before seeding
  await mongoose.connection.dropDatabase();
  log("Database dropped. Starting fresh seed...");

  const usersResult = await seedUsers(COUNTS.USERS);
  const categoriesResult = await seedCategories(usersResult.adminId);
  const spotsResult = await seedTouristSpots(COUNTS.TOURIST_SPOTS);
  const reservationsResult = await seedReservations(COUNTS.RESERVATIONS);
  const ordersResult = await seedOrders(COUNTS.ORDERS);
  const newsletterResult = await seedNewsletter(COUNTS.NEWSLETTER);

  writeCsvSummary([
    { entity: "users", count: usersResult.created, notes: "Includes 1 admin" },
    { entity: "categories", count: categoriesResult.created, notes: "Tour categories" },
    { entity: "tourist_spots", count: spotsResult.created, notes: "Random faker data" },
    { entity: "reservations", count: reservationsResult.created, notes: "Future dated" },
    { entity: "orders", count: ordersResult.created, notes: "Linked to paid reservations" },
    { entity: "newsletter", count: newsletterResult.created, notes: "Sample subscribers" }
  ]);

  const duration = ((Date.now() - start) / 1000).toFixed(2);
  log(`Seeding complete in ${duration}s.`);
  await mongoose.connection.close();
  log("MongoDB connection closed.");
}

run().catch(err => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
