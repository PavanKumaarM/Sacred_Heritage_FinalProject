
const mongoose = require("mongoose");
const Cart = require("../models/Cart");
const Product = require("../models/Product");

const getCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId })
    .populate("items.productId", "name price image stock isActive");

  if (!cart) {
    try {
      cart = await Cart.create({
        user: userId,
        items: []
      });
    } catch (error) {
      // Handle simultaneous cart creation requests.
      if (error.code !== 11000) throw error;

      cart = await Cart.findOne({ user: userId });
    }
  }

  return cart;
};

const addItem = async (userId, productId, quantity) => {
  if (!mongoose.isValidObjectId(productId)) {
    throw new Error("Invalid product ID");
  }

  if (!Number.isInteger(quantity) || quantity < 1) {
    throw new Error("Quantity must be a positive integer");
  }

  const product = await Product.findOne({
    _id: productId,
    isActive: true
  });

  if (!product) {
    throw new Error("Product unavailable");
  }

  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    try {
      cart = await Cart.create({
        user: userId,
        items: []
      });
    } catch (error) {
      if (error.code !== 11000) throw error;
      cart = await Cart.findOne({ user: userId });
    }
  }

  const existingItem = cart.items.find(
    item => item.productId.toString() === productId.toString()
  );

  const newQuantity = existingItem
    ? existingItem.quantity + quantity
    : quantity;

  if (newQuantity > product.stock) {
    throw new Error("Insufficient stock");
  }

  if (existingItem) {
    existingItem.quantity = newQuantity;
    existingItem.price = product.price;
    existingItem.name = product.name;
    existingItem.image = product.image;
  } else {
    cart.items.push({
      productId: product._id,
      name: product.name,
      price: product.price,
      quantity,
      image: product.image
    });
  }

  await cart.save();

  return cart;
};

const updateItem = async (userId, itemId, quantity) => {
  if (!mongoose.isValidObjectId(itemId)) {
    throw new Error("Invalid cart item ID");
  }

  if (!Number.isInteger(quantity) || quantity < 1) {
    throw new Error("Quantity must be a positive integer");
  }

  const cart = await Cart.findOne({ user: userId });

  if (!cart) {
    throw new Error("Cart not found");
  }

  const item = cart.items.id(itemId);

  if (!item) {
    throw new Error("Cart item not found");
  }

  const product = await Product.findById(item.productId);

  if (!product || !product.isActive) {
    throw new Error("Product unavailable");
  }

  if (quantity > product.stock) {
    throw new Error("Insufficient stock");
  }

  item.quantity = quantity;
  item.price = product.price;
  item.name = product.name;
  item.image = product.image;

  await cart.save();

  return cart;
};

const removeItem = async (userId, itemId) => {
  if (!mongoose.isValidObjectId(itemId)) {
    throw new Error("Invalid cart item ID");
  }

  const cart = await Cart.findOne({ user: userId });

  if (!cart) {
    throw new Error("Cart not found");
  }

  const item = cart.items.id(itemId);

  if (!item) {
    throw new Error("Cart item not found");
  }

  item.deleteOne();

  await cart.save();

  return cart;
};

const clearCart = async (userId) => {
  const cart = await Cart.findOne({ user: userId });

  if (!cart) {
    throw new Error("Cart not found");
  }

  cart.items = [];

  await cart.save();

  return cart;
};

module.exports = {
  getCart,
  addItem,
  updateItem,
  removeItem,
  clearCart
};
