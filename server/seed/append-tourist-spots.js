require("dotenv").config({ path: "./.env" });
const { connect, log } = require("./utils");
const seedTouristSpots = require("./seed-tourist-spots");

async function run() {
  const count = parseInt(process.argv[2] || process.env.SEED_TOURIST_SPOTS || "80", 10);
  await connect();
  log(`Appending ${count} tourist spots...`);
  const res = await seedTouristSpots(count, { append: true });
  log(`Done. Added ${res.created} spots.`);
  process.exit(0);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
