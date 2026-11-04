const express = require("express");
const router = express.Router();

const productController = require("../controllers/productController");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// Get products belonging to a particular temple
router.get(
    "/temple/:templeId",
    productController.getProductsByTemple
);

// Get all products with search, filters and sorting
router.get("/", productController.getAllProducts);

// Get individual product
router.get("/:id", productController.getProductById);

// Add product
router.post(
    "/",
    authMiddleware,
    adminMiddleware,
    productController.createProduct
);

// Update product
router.patch(
    "/:id",
    authMiddleware,
    adminMiddleware,
    productController.updateProduct
);

// Delete product
router.delete(
    "/:id",
    authMiddleware,
    adminMiddleware,
    productController.deleteProduct
);

module.exports = router;