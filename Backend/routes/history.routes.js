const express = require("express");
const router = express.Router();

const {
  getHistory
} = require("../controllers/history.controller");

const { protect } = require("../middleware/auth.middleware");

router.get("/", protect, getHistory);

module.exports = router;