const Category = require("../models/category.model");
const { log } = require("./utils");

const categoryArray = [
  { value: "beach", label: "Beach", icon: "FaUmbrellaBeach" },
  { value: "mountain", label: "Mountain", icon: "FaMountain" },
  { value: "lake", label: "Lake", icon: "BiWater" },
  { value: "forest", label: "Forest", icon: "MdForest" },
  { value: "desert", label: "Desert", icon: "GiCactus" },
  { value: "island", label: "Island", icon: "GiIsland" },
  { value: "cave", label: "Cave", icon: "GiMountainCave" },
  { value: "waterfall", label: "Waterfall", icon: "GiWaterfall" },
  { value: "river", label: "River", icon: "FaSwimmingPool" }
];

module.exports = async function seedCategories(adminId) {
  const existing = await Category.countDocuments();
  if (existing > 0) {
    log(`Categories already exist (${existing}), skipping category seeding.`);
    const ids = await Category.find().distinct("_id");
    return { created: 0, categoryIds: ids };
  }

  const docs = categoryArray.map(c => ({ ...c, postedBy: adminId }));
  const inserted = await Category.insertMany(docs);
  log(`Inserted ${inserted.length} categories.`);
  return { created: inserted.length, categoryIds: inserted.map(c => c._id) };
};
