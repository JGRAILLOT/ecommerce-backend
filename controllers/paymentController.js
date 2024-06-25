//controllers/paymentController.js
const paypal = require("../config/paypal");
const stripe = require("../config/stripe");
const Order = require("../models/order");
const Cart = require("../models/cart");

const createPayPalPayment = async (req, res) => {
  const { cartId, address } = req.body;

  const cart = await Cart.findById(cartId);
  if (!cart) {
    return res.status(404).json({ message: "Cart not found" });
  }

  const paymentData = {
    intent: "sale",
    payer: {
      payment_method: "paypal",
    },
    redirect_urls: {
      return_url: "http://localhost:3000/success",
      cancel_url: "http://localhost:3000/cancel",
    },
    transactions: [
      {
        amount: {
          total: cart.totalPrice,
          currency: "USD",
        },
        description: "Your purchase description",
      },
    ],
  };

  paypal.payment.create(paymentData, (error, payment) => {
    if (error) {
      return res
        .status(500)
        .json({ message: "Error creating PayPal payment", error });
    } else {
      res.json({ paymentId: payment.id, approvalUrl: payment.links[1].href });
    }
  });
};

const executePayPalPayment = async (req, res) => {
  const { paymentId, payerId, cartId, address } = req.body;

  const executePaymentData = { payer_id: payerId };

  paypal.payment.execute(
    paymentId,
    executePaymentData,
    async (error, payment) => {
      if (error) {
        return res
          .status(500)
          .json({ message: "Error executing PayPal payment", error });
      } else {
        const order = new Order({
          userId: req.user.id,
          cartId,
          address,
          paymentMethod: "PayPal",
          paymentId,
          totalPrice: payment.transactions[0].amount.total,
        });
        await order.save();
        await Cart.findByIdAndDelete(cartId); // Clear the cart after purchase
        res.json(order);
      }
    }
  );
};

const createStripePayment = async (req, res) => {
  const { cartId, address, token } = req.body;

  const cart = await Cart.findById(cartId);
  if (!cart) {
    return res.status(404).json({ message: "Cart not found" });
  }

  try {
    const charge = await stripe.charges.create({
      amount: cart.totalPrice * 100, // Amount in cents
      currency: "usd",
      description: "Your purchase description",
      source: token,
    });

    const order = new Order({
      userId: req.user.id,
      cartId,
      address,
      paymentMethod: "Stripe",
      paymentId: charge.id,
      totalPrice: cart.totalPrice,
    });
    await order.save();
    await Cart.findByIdAndDelete(cartId); // Clear the cart after purchase
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Error creating Stripe payment", error });
  }
};

module.exports = {
  createPayPalPayment,
  executePayPalPayment,
  createStripePayment,
};
