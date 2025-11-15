const bcrypt = require("bcrypt");
const User = require("../models/user.model");
const { log, randInt } = require("./utils");

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

  for (let i = 0; i < count; i++) {
    const password = await bcrypt.hash(`User${i + 1}@${randInt(100,999)}`, 10);
    users.push({
      name: `Sample User ${i + 1}`,
      email: `user${i + 1}@example.com`,
      password,
      role: "user",
    });
  }

  const inserted = await User.create(users);
  log(`Inserted ${inserted.length} users (including admin).`);
  const admin = inserted.find(u => u.role === "admin");
  return { created: inserted.length, adminId: admin._id };
};
