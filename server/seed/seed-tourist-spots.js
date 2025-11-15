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

    // Use Unsplash for realistic travel images
    const imageKeywords = ['travel', 'resort', 'hotel', 'vacation', 'beach', 'mountain', 'nature'];
    const randomKeyword = pick(imageKeywords);
    const imageUrl = `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 200000000000)}?w=800&q=80&fit=crop&auto=format`;
    
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
