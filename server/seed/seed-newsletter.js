const Newsletter = require("../models/newsletter.model");
const { log, randInt } = require("./utils");

module.exports = async function seedNewsletter(count = 12) {
  const existing = await Newsletter.countDocuments();
  if (existing > 0) {
    log(`Newsletter entries already exist (${existing}), skipping newsletter seeding.`);
    const ids = await Newsletter.find().distinct("_id");
    return { created: 0, newsletterIds: ids };
  }

  const entries = [];
  for (let i = 0; i < count; i++) {
    entries.push({ email: `subscriber${i + 1}_${randInt(100,999)}@example.com` });
  }
  const inserted = await Newsletter.create(entries);
  log(`Inserted ${inserted.length} newsletter subscribers.`);
  return { created: inserted.length, newsletterIds: inserted.map(n => n._id) };
};
