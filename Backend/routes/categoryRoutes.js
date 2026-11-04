const express = require("express");
const router = express.Router();

const categoryController = require("../controllers/categoryController");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// Get all categories
router.get("/", categoryController.getAllCategories);

// Create category
router.post(
    "/",
    authMiddleware,
    adminMiddleware,
    categoryController.createCategory
);

// Update category
router.patch(
    "/:id",
    authMiddleware,
    adminMiddleware,
    categoryController.updateCategory
);

// Delete category
router.delete(
    "/:id",
    authMiddleware,
    adminMiddleware,
    categoryController.deleteCategory
);

module.exports = router;