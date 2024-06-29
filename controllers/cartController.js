// controllers/cartController.js
const Cart = require("../models/cart");

const getUserCart = async (req, res) => {
  try {
    const { userId } = req.body;
    const cart = await Cart.find({ userId }).populate("productId");
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const addToCart = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;
    console.log({ userId, productId, quantity });
    if (!productId || !quantity || !userId) {
      return res
        .status(400)
        .json({ message: "User ID, Product ID and quantity are required." });
    }

    // Create a new cart item with quantity
    const cartItem = new Cart({
      userId,
      productId,
      quantity,
    });

    await cartItem.save();
    res.status(201).json(cartItem);
  } catch (error) {
    console.error("Add to cart error:", error);
    res.status(500).json({ error: error.message });
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
    const { userId } = req.body;
    const result = await Cart.deleteMany({ userId });
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
