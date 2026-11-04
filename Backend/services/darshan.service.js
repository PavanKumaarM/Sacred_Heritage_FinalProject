
const mongoose = require("mongoose");

const DarshanType = require("../models/DarshanType");
const DarshanSlot = require("../models/DarshanSlot");

const isValidTime = (time) => {
  return typeof time === "string" &&
    /^([01]\d|2[0-3]):[0-5]\d$/.test(time);
};

const getDarshanTypes = async (templeId) => {
  if (!mongoose.isValidObjectId(templeId)) {
    throw new Error("Invalid temple ID");
  }

  return DarshanType.find({
    templeId,
    isActive: true
  }).sort({ createdAt: 1 });
};

const createDarshanType = async (data) => {
  const { templeId, name, description = "", price, durationMinutes = 30 } = data;

  if (!mongoose.isValidObjectId(templeId)) {
    throw new Error("Invalid temple ID");
  }

  if (typeof name !== "string" || !name.trim()) {
    throw new Error("Darshan name is required");
  }

  if (
    typeof price !== "number" ||
    !Number.isFinite(price) ||
    price < 0
  ) {
    throw new Error("Darshan price must be zero or greater");
  }

  if (!Number.isInteger(durationMinutes) || durationMinutes < 1) {
    throw new Error("Duration must be a positive integer");
  }

  return DarshanType.create({
    templeId,
    name: name.trim(),
    description,
    price,
    durationMinutes,
    isActive: true
  });
};

const getAvailableSlots = async (templeId, darshanTypeId, date) => {
  if (
    !mongoose.isValidObjectId(templeId) ||
    !mongoose.isValidObjectId(darshanTypeId)
  ) {
    throw new Error("Invalid temple or darshan type ID");
  }

  if (
    typeof date !== "string" ||
    !/^\d{4}-\d{2}-\d{2}$/.test(date)
  ) {
    throw new Error("Date must be in YYYY-MM-DD format");
  }

  const parsedDate = new Date(`${date}T00:00:00.000Z`);

  if (
    isNaN(parsedDate.getTime()) ||
    parsedDate.toISOString().slice(0, 10) !== date
  ) {
    throw new Error("Invalid date");
  }

  const darshanType = await DarshanType.findOne({
    _id: darshanTypeId,
    templeId,
    isActive: true
  });

  if (!darshanType) {
    throw new Error("Darshan type does not belong to this temple");
  }

  const start = parsedDate;
  const end = new Date(parsedDate);
  end.setUTCDate(end.getUTCDate() + 1);

  return DarshanSlot.find({
    templeId,
    darshanType: darshanTypeId,
    date: { $gte: start, $lt: end },
    isActive: true,
    $expr: { $lt: ["$bookedCount", "$capacity"] }
  }).sort({ startTime: 1 });
};

const createSlot = async (data) => {
  const {
    templeId,
    darshanType,
    date,
    startTime,
    endTime,
    capacity
  } = data;

  if (
    !mongoose.isValidObjectId(templeId) ||
    !mongoose.isValidObjectId(darshanType)
  ) {
    throw new Error("Invalid temple or darshan type ID");
  }

  const type = await DarshanType.findOne({
    _id: darshanType,
    templeId,
    isActive: true
  });

  if (!type) {
    throw new Error("Invalid temple or darshan type");
  }

  if (
    typeof date !== "string" ||
    !/^\d{4}-\d{2}-\d{2}$/.test(date)
  ) {
    throw new Error("Date must be in YYYY-MM-DD format");
  }

  const parsedDate = new Date(`${date}T00:00:00.000Z`);

  if (
    isNaN(parsedDate.getTime()) ||
    parsedDate.toISOString().slice(0, 10) !== date
  ) {
    throw new Error("Invalid date");
  }

  if (!isValidTime(startTime) || !isValidTime(endTime)) {
    throw new Error("Time must use HH:mm format");
  }

  if (startTime >= endTime) {
    throw new Error("End time must be later than start time");
  }

  if (!Number.isInteger(capacity) || capacity < 1) {
    throw new Error("Capacity must be a positive integer");
  }

  const duplicateSlot = await DarshanSlot.findOne({
    templeId,
    darshanType,
    date: {
      $gte: parsedDate,
      $lt: new Date(parsedDate.getTime() + 24 * 60 * 60 * 1000)
    },
    startTime,
    endTime
  });

  if (duplicateSlot) {
    throw new Error("This darshan slot already exists");
  }

  return DarshanSlot.create({
    templeId,
    darshanType,
    date: parsedDate,
    startTime,
    endTime,
    capacity,
    bookedCount: 0,
    isActive: true
  });
};

module.exports = {
  getDarshanTypes,
  createDarshanType,
  getAvailableSlots,
  createSlot
};
