// controllers/cartController.js
const Cart = require("../models/cart");

const getUserCart = async (req, res) => {
  try {
    const cart = await Cart.find({ userId: req.user._id }).populate(
      "productId"
    );
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const addToCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const cartItem = new Cart({ userId: req.user._id, productId });
    await cartItem.save();
    res.status(201).json(cartItem);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const cartItem = await Cart.findByIdAndDelete(req.params.id);
    if (!cartItem)
      return res.status(404).json({ error: "Cart item not found" });
    res.json({ message: "Item removed from cart" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const clearCart = async (req, res) => {
  try {
    // Remove all items where the userId matches the logged-in user's ID
    const result = await Cart.deleteMany({ userId: req.user._id });
    if (result.deletedCount === 0) {
      return res
        .status(404)
        .json({ message: "No items in the cart to delete." });
    }
    res.json({ message: "Cart cleared successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getUserCart, addToCart, removeFromCart, clearCart };
