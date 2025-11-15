const TouristSpot = require("../models/tourists-spots.model");
const User = require("../models/user.model");
const { faker } = require("@faker-js/faker");
const { log, randInt } = require("./utils");

module.exports = async function seedReviews(maxPerSpot = 5) {
  // If any spot already has reviews, skip (fresh seeds drop DB anyway)
  const spots = await TouristSpot.find({}, { _id: 1, host: 1, reviews: 1 });
  const users = await User.find({ role: "user" }, { _id: 1 });

  if (!spots.length || !users.length) {
    log("Cannot seed reviews: need tourist spots and users.");
    return { created: 0, reviewCountBySpot: {} };
  }

  const allUserIds = users.map((u) => u._id.toString());
  const ops = [];
  const reviewCountBySpot = {};
  let total = 0;

  for (const spot of spots) {
    const target = randInt(0, Number(maxPerSpot) || 0);

    // Build exclusion set: existing reviewers and host
    const excluded = new Set((spot.reviews || []).map((r) => r.user.toString()));
    if (spot.host) excluded.add(spot.host.toString());

    // Candidates are users not excluded
    const candidates = allUserIds.filter((id) => !excluded.has(id));
    if (!candidates.length || target === 0) {
      reviewCountBySpot[spot._id.toString()] = 0;
      continue;
    }

    const picked = faker.helpers.shuffle(candidates).slice(0, Math.min(target, candidates.length));

    const newReviews = picked.map((userId) => ({
      rating: randInt(1, 5),
      comment: faker.lorem.sentences({ min: 1, max: 3 }),
      date: faker.date.recent({ days: 90 }),
      user: userId,
    }));

    if (newReviews.length) {
      ops.push({
        updateOne: {
          filter: { _id: spot._id },
          update: { $push: { reviews: { $each: newReviews } } },
        },
      });
      reviewCountBySpot[spot._id.toString()] = newReviews.length;
      total += newReviews.length;
    } else {
      reviewCountBySpot[spot._id.toString()] = 0;
    }
  }

  if (ops.length > 0) {
    await TouristSpot.bulkWrite(ops);
    log(`Inserted ${total} reviews across ${ops.length} spots.`);
  } else {
    log("No reviews inserted (no eligible candidates or zero targets).");
  }

  return { created: total, reviewCountBySpot };
};
