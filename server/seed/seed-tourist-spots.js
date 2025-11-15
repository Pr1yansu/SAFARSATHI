const TouristSpot = require("../models/tourists-spots.model");
const User = require("../models/user.model");
const Category = require("../models/category.model");
const { faker } = require("@faker-js/faker");
const Countries = require("world-countries");
const { log, pick, randInt } = require("./utils");
const { searchUnsplashImages } = require("../utils/unsplash");

module.exports = async function seedTouristSpots(count = 20, options = {}) {
  const append = options.append || process.env.SEED_APPEND === "true";
  const existing = await TouristSpot.countDocuments();
  if (!append && existing > 0) {
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

  // Realistic tourist spot names by category
  const spotNames = {
    beach: ["Sunset Beach Resort", "Paradise Cove", "Azure Bay Hotel", "Coral Reef Villas", "Ocean Breeze Resort"],
    mountain: ["Alpine Peak Lodge", "Mountain View Retreat", "Summit Valley Inn", "Highland Chalets", "Rocky Ridge Resort"],
    city: ["Downtown Loft", "City Center Apartment", "Urban Skyline Suite", "Metro Plaza Hotel", "Modern City Stay"],
    forest: ["Woodland Cabin", "Forest Haven Lodge", "Pine Tree Retreat", "Nature's Edge Cottage", "Evergreen Resort"],
    lake: ["Lakeside Villa", "Waterfront Cabin", "Lake View Lodge", "Tranquil Waters Resort", "Blue Lake House"],
    desert: ["Desert Oasis Resort", "Sand Dunes Villa", "Mirage Hotel", "Canyon View Lodge", "Sahara Retreat"]
  };

  const spots = [];
  // Pre-fetch Unsplash images per category to avoid hitting rate limits
  const categoryImageCache = {};
  async function getImageForCategory(label, i) {
    try {
      const key = (label || "travel").toLowerCase();
      if (!categoryImageCache[key]) {
        const query = `${key} travel resort hotel landscape`;
        categoryImageCache[key] = await searchUnsplashImages({ query, perPage: 30 });
      }
      const arr = categoryImageCache[key];
      if (Array.isArray(arr) && arr.length) {
        return arr[(i + Math.floor(Math.random() * arr.length)) % arr.length];
      }
    } catch (_) {}
    // Fallback to Unsplash Source when API unavailable
    return `https://source.unsplash.com/featured/800x600?${encodeURIComponent(label || "travel")},travel,resort&sig=${i+1}`;
  }
  for (let i = 0; i < count; i++) {
    const country = pick(Countries);
    const category = pick(categories);
    const host = pick(users);
    
    // Select name based on category or use generic
    const categoryKey = category.label.toLowerCase();
    const names = spotNames[categoryKey] || [faker.company.name() + " Resort"];
    const name = pick(names) || `${faker.location.city()} ${faker.company.buzzAdjective()} Resort`;
    
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
      amenities[k] = { count: randInt(0,2), icon: v.icon };
    });

    // Get image URL from Unsplash API (with fallback)
    const imageUrl = await getImageForCategory(category.label, i);
    
    spots.push({
      category: category._id,
      name: name,
      image: {
        secure_url: imageUrl,
        public_id: faker.string.uuid()
      },
      description: `Experience the perfect getaway at ${name}. ${faker.lorem.sentences(2)} Enjoy world-class amenities and breathtaking views.`,
      info: {
        guests: randInt(2,8),
        rooms: randInt(1,4),
        adults: randInt(2,6),
        children: randInt(0,3),
        infants: randInt(0,2)
      },
      address: faker.location.streetAddress(),
      price: faker.number.float({ min: 80, max: 450, fractionDigits: 2 }),
      amenities,
      location: {
        lat: country.latlng[0],
        lng: country.latlng[1],
        address: country.name.common
      },
      host: host._id,
      verified: true
    });
  }

  const inserted = await TouristSpot.create(spots);
  log(`Inserted ${inserted.length} tourist spots.`);
  return { created: inserted.length, touristSpotIds: inserted.map(s => s._id) };
};
