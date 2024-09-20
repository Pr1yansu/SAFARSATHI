const Category = require("../models/category.model.js");
const logger = require("../utils/logger.utils.js");

exports.createCategory = async (req, res) => {
  try {
    const { name, icon } = req.body;

    const categoryExist = await Category.findOne({ value: name });

    if (categoryExist) {
      return res.status(400).json({ message: "Category already exists" });
    }

    const category = await Category.create({
      value: name,
      label: name,
      icon,
      postedBy: req.user._id,
    });

    return res.status(201).json({
      category: category,
      message: "Category created successfully",
    });
  } catch (error) {
    logger.error(error);
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    return res.status(400).json({ message: "Create category failed" });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find({}).sort({ createdAt: -1 });

    return res.status(200).json({ categories: categories });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch categories" });
  }
};

exports.updateCategory = async (req, res) => {};

exports.deleteCategory = async (req, res) => {
  try {
    const { categories } = req.body;

    await Category.deleteMany({ _id: { $in: categories } });

    return res.status(200).json({ message: "Categories deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete categories" });
  }
};

exports.generateCategories = async (req, res) => {
  const categoryArray = [
    {
      value: "beach",
      label: "Beach",
      icon: "FaUmbrellaBeach ",
    },
    {
      value: "mountain",
      label: "Mountain",
      icon: "FaMountain",
    },
    {
      value: "lake",
      label: "Lake",
      icon: "BiWater",
    },
    {
      value: "forest",
      label: "Forest",
      icon: "MdForest",
    },
    {
      value: "desert",
      label: "Desert",
      icon: "GiCactus",
    },
    {
      value: "island",
      label: "Island",
      icon: "GiIsland",
    },
    {
      value: "cave",
      label: "Cave",
      icon: "GiMountainCave",
    },
    {
      value: "waterfall",
      label: "Waterfall",
      icon: "GiWaterfall",
    },
    {
      value: "river",
      label: "River",
      icon: "FaSwimmingPool",
    },
  ];

  try {
    await Category.insertMany(categoryArray);
    return "Categories generated";
  } catch (error) {
    return error;
  }
};
