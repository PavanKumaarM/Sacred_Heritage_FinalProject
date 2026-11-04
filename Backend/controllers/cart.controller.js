
const Cart = require("../models/Cart");
const Product = require("../models/Product");

// GET CART
const getCart = async (req, res) => {
  const userId = req.user.id || req.user._id;

  let cart = await Cart.findOne({ user: userId })
    .populate("items.productId");

  if (!cart) {
    cart = await Cart.create({
      user: userId,
      items: []
    });
  }

  return res.status(200).json({
    success: true,
    cart
  });
};

// ADD ITEM TO CART
const addItem = async (req, res) => {
  const userId = req.user.id || req.user._id;
  const { productId, quantity = 1 } = req.body;

  if (!productId || !Number.isInteger(quantity) || quantity < 1) {
    return res.status(400).json({
      success: false,
      message: "Valid productId and quantity are required"
    });
  }

  const product = await Product.findOne({
    _id: productId,
    isActive: true
  });

  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found or unavailable"
    });
  }

  if (product.stock < quantity) {
    return res.status(400).json({
      success: false,
      message: "Insufficient product stock"
    });
  }

  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    cart = new Cart({
      user: userId,
      items: []
    });
  }

  const existingItem = cart.items.find(
    item => item.productId.toString() === productId
  );

  if (existingItem) {
    const newQuantity = existingItem.quantity + quantity;

    if (newQuantity > product.stock) {
      return res.status(400).json({
        success: false,
        message: "Requested quantity exceeds available stock"
      });
    }

    existingItem.quantity = newQuantity;
    existingItem.price = product.price;
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

  return res.status(200).json({
    success: true,
    message: "Product added to cart",
    cart
  });
};

// UPDATE ITEM QUANTITY
const updateItem = async (req, res) => {
  const userId = req.user.id || req.user._id;
  const { itemId } = req.params;
  const { quantity } = req.body;

  if (!Number.isInteger(quantity) || quantity < 1) {
    return res.status(400).json({
      success: false,
      message: "Quantity must be at least 1"
    });
  }

  const cart = await Cart.findOne({ user: userId });

  if (!cart) {
    return res.status(404).json({
      success: false,
      message: "Cart not found"
    });
  }

  const item = cart.items.id(itemId);

  if (!item) {
    return res.status(404).json({
      success: false,
      message: "Cart item not found"
    });
  }

  const product = await Product.findById(item.productId);

  if (!product || !product.isActive) {
    return res.status(404).json({
      success: false,
      message: "Product unavailable"
    });
  }

  if (quantity > product.stock) {
    return res.status(400).json({
      success: false,
      message: "Requested quantity exceeds available stock"
    });
  }

  item.quantity = quantity;
  item.price = product.price;

  await cart.save();

  return res.status(200).json({
    success: true,
    message: "Cart quantity updated",
    cart
  });
};

// REMOVE ITEM FROM CART
const removeItem = async (req, res) => {
  const userId = req.user.id || req.user._id;
  const { itemId } = req.params;

  const cart = await Cart.findOne({ user: userId });

  if (!cart) {
    return res.status(404).json({
      success: false,
      message: "Cart not found"
    });
  }

  const item = cart.items.id(itemId);

  if (!item) {
    return res.status(404).json({
      success: false,
      message: "Cart item not found"
    });
  }

  item.deleteOne();

  await cart.save();

  return res.status(200).json({
    success: true,
    message: "Item removed from cart",
    cart
  });
};

// CLEAR ENTIRE CART
const clearCart = async (req, res) => {
  const userId = req.user.id || req.user._id;

  const cart = await Cart.findOne({ user: userId });

  if (!cart) {
    return res.status(404).json({
      success: false,
      message: "Cart not found"
    });
  }

  cart.items = [];

  await cart.save();

  return res.status(200).json({
    success: true,
    message: "Cart cleared successfully",
    cart
  });
};

module.exports = {
  getCart,
  addItem,
  updateItem,
  removeItem,
  clearCart
};
