
const mongoose = require("mongoose");
const Cart = require("../models/Cart");
const Product = require("../models/Product");

const createError = (message, statusCode) => {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
};

const populateCart = (cart) => {
    return cart.populate({
        path: "items.productId",
        select: "name description price image stock isActive temple category",
        populate: [
            {
                path: "temple",
                select: "name location image"
            },
            {
                path: "category",
                select: "name image"
            }
        ]
    });
};

const findOrCreateCart = async (userId) => {
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
        try {
            cart = await Cart.create({
                user: userId,
                items: []
            });
        } catch (error) {
            // Another request may have created the cart simultaneously.
            if (error.code !== 11000) throw error;

            cart = await Cart.findOne({ user: userId });
        }
    }

    if (!cart) {
        throw createError("Unable to retrieve cart", 500);
    }

    return cart;
};

const getCart = async (userId) => {
    const cart = await findOrCreateCart(userId);
    return await populateCart(cart);
};

const addItem = async (userId, productId, quantity = 1) => {

    if (!mongoose.isValidObjectId(productId)) {
        throw createError("Invalid product ID", 400);
    }

    if (!Number.isInteger(quantity) || quantity < 1) {
        throw createError("Quantity must be a positive integer", 400);
    }

    const product = await Product.findOne({
        _id: productId,
        isActive: true
    });

    if (!product) {
        throw createError("Product unavailable", 404);
    }

    const cart = await findOrCreateCart(userId);

    const existingItem = cart.items.find(
        item => item.productId.toString() === productId.toString()
    );

    const newQuantity = existingItem
        ? existingItem.quantity + quantity
        : quantity;

    if (newQuantity > product.stock) {
        throw createError(
            `Only ${product.stock} units are available`,
            400
        );
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

    return await populateCart(cart);
};

const updateItem = async (userId, itemId, quantity) => {

    if (!mongoose.isValidObjectId(itemId)) {
        throw createError("Invalid cart item ID", 400);
    }

    if (!Number.isInteger(quantity) || quantity < 1) {
        throw createError("Quantity must be a positive integer", 400);
    }

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
        throw createError("Cart not found", 404);
    }

    const item = cart.items.id(itemId);

    if (!item) {
        throw createError("Cart item not found", 404);
    }

    const product = await Product.findOne({
        _id: item.productId,
        isActive: true
    });

    if (!product) {
        throw createError("Product unavailable", 404);
    }

    if (quantity > product.stock) {
        throw createError(
            `Only ${product.stock} units are available`,
            400
        );
    }

    item.quantity = quantity;
    item.price = product.price;
    item.name = product.name;
    item.image = product.image;

    await cart.save();

    return await populateCart(cart);
};

const removeItem = async (userId, itemId) => {

    if (!mongoose.isValidObjectId(itemId)) {
        throw createError("Invalid cart item ID", 400);
    }

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
        throw createError("Cart not found", 404);
    }

    const item = cart.items.id(itemId);

    if (!item) {
        throw createError("Cart item not found", 404);
    }

    item.deleteOne();

    await cart.save();

    return await populateCart(cart);
};

const clearCart = async (userId) => {

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
        throw createError("Cart not found", 404);
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
