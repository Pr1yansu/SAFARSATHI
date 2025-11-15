const bcrypt = require("bcrypt");
const User = require("../models/user.model");
const { faker } = require("@faker-js/faker");
const { log } = require("./utils");

module.exports = async function seedUsers(count = 8) {
  const existing = await User.countDocuments();
  if (existing > 0) {
    log(`Users already exist (${existing}), skipping user seeding.`);
    const admin = await User.findOne({ role: "admin" });
    return { created: 0, adminId: admin ? admin._id : null };
  }

  const users = [];
  const adminPassword = await bcrypt.hash("Admin@123", 10);
  users.push({
    name: "Admin User",
    email: "admin@example.com",
    password: adminPassword,
    role: "admin",
  });

  const defaultPasswordHash = await bcrypt.hash("User@123", 10);
  for (let i = 0; i < count; i++) {
    users.push({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: defaultPasswordHash,
      role: "user",
    });
  }

  const inserted = await User.create(users);
  log(`Inserted ${inserted.length} users (including admin).`);
  const admin = inserted.find(u => u.role === "admin");
  return { created: inserted.length, adminId: admin._id };
};
