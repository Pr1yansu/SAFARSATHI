require("dotenv").config({ path: "./.env" });
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const { faker } = require("@faker-js/faker");

async function connect() {
  if (mongoose.connection.readyState === 1) return;
  await mongoose.connect(process.env.MONGO_URI, {
    dbName: process.env.MONGO_DB_NAME,
  });
}

function randInt(min, max) {
  return faker.number.int({ min, max });
}

function pick(array) {
  return faker.helpers.arrayElement(array);
}

function log(msg) {
  console.log(`[SEED] ${msg}`);
}

function writeCsvSummary(rows) {
  const header = "entity,count,notes";
  const data = [header, ...rows.map((r) => `${r.entity},${r.count},${escapeCsv(r.notes)}`)].join("\n");
  const file = path.join(__dirname, "seed-summary.csv");
  fs.writeFileSync(file, data, "utf-8");
}

function escapeCsv(str = "") {
  if (str.includes(",") || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

module.exports = { connect, randInt, pick, log, writeCsvSummary };
