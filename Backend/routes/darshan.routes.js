const express = require("express");
const router = express.Router();

const {
  getDarshanTypes,
  getAvailableSlots
} = require("../controllers/darshan.controller");

router.get("/types/:templeId", getDarshanTypes);
router.get("/slots", getAvailableSlots);

module.exports = router;