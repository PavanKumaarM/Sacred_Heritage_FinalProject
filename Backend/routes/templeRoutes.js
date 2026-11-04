
const express = require("express");
const router = express.Router();

const templeController = require("../controllers/templeController");
const { protect } = require("../middleware/auth.middleware");
const asyncHandler = require("../middleware/asyncHandler");

// Public routes
router.get("/", asyncHandler(templeController.getAllTemples));

// Temple details with associated products
router.get("/:id/details", asyncHandler(templeController.getTempleDetails));

// Individual temple
router.get("/:id", asyncHandler(templeController.getTempleById));

// Authenticated routes
router.post("/", protect, asyncHandler(templeController.createTemple));

router.patch("/:id", protect, asyncHandler(templeController.updateTemple));

router.delete("/:id", protect, asyncHandler(templeController.deleteTemple));

module.exports = router;
