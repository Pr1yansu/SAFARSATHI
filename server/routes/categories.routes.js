const router = require("express").Router();

const {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categories.controller.js");

const {
  adminMiddleware,
  authMiddleware,
} = require("../middleware/auth.middleware");

router.get("/", getCategories);
router.post("/create", authMiddleware, adminMiddleware, createCategory);
router.put("/update/:id", authMiddleware, adminMiddleware, updateCategory);
router.delete("/delete", authMiddleware, adminMiddleware, deleteCategory);

module.exports = router;
