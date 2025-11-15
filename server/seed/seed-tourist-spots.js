const TouristSpot = require("../models/tourists-spots.model");
const User = require("../models/user.model");
const Category = require("../models/category.model");
const { faker } = require("@faker-js/faker");
const Countries = require("world-countries");
const { log, pick, randInt } = require("./utils");

module.exports = async function seedTouristSpots(count = 20) {
  const existing = await TouristSpot.countDocuments();
  if (existing > 0) {
    log(`Tourist spots already exist (${existing}), skipping tourist spot seeding.`);
    const ids = await TouristSpot.find().distinct("_id");
    return { created: 0, touristSpotIds: ids };
  }

  const users = await User.find({ role: "user" });
  const categories = await Category.find();
  if (!users.length || !categories.length) {
    log("Cannot seed tourist spots: need users and categories.");
    return { created: 0, touristSpotIds: [] };
  }

  const spots = [];
  for (let i = 0; i < count; i++) {
    const country = pick(Countries);
    const category = pick(categories);
    const host = pick(users);
    const amenitiesBase = {
      wifi: { icon: "AiOutlineWifi" },
      tv: { icon: "RiTv2Line" },
      kitchen: { icon: "MdOutlineKitchen" },
      ac: { icon: "TbAirConditioning" },
      heating: { icon: "IoMdBonfire" },
      parking: { icon: "AiOutlineCar" }
    };
    const amenities = {};
    Object.entries(amenitiesBase).forEach(([k,v]) => {
      amenities[k] = { count: randInt(0,1), icon: v.icon };
    });

    spots.push({
      category: category._id,
      name: faker.location.city(),
      image: {
        secure_url: faker.image.urlLoremFlickr({ category: "travel" }),
        public_id: faker.string.uuid()
      },
      description: faker.lorem.paragraph(),
      info: {
        guests: randInt(1,10),
        rooms: randInt(1,5),
        adults: randInt(1,10),
        children: randInt(0,5),
        infants: randInt(0,3)
      },
      address: faker.location.streetAddress(),
      price: faker.number.float({ min: 50, max: 500 }),
      amenities,
      location: {
        lat: country.latlng[0],
        lng: country.latlng[1],
        address: country.name.common
      },
      host: host._id,
      verified: false
    });
  }

  const inserted = await TouristSpot.create(spots);
  log(`Inserted ${inserted.length} tourist spots.`);
  return { created: inserted.length, touristSpotIds: inserted.map(s => s._id) };
};
