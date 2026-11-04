const express = require("express");
const router = express.Router();

const templeController = require("../controllers/templeController");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

router.get("/", templeController.getAllTemples);

router.get("/:id", templeController.getTempleById);

router.post(
    "/",
    authMiddleware,
    adminMiddleware,
    templeController.createTemple
);

router.patch(
    "/:id",
    authMiddleware,
    adminMiddleware,
    templeController.updateTemple
);

router.delete(
    "/:id",
    authMiddleware,
    adminMiddleware,
    templeController.deleteTemple
);

module.exports = router;