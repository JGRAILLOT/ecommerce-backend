// server.js
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const productRoutes = require("./routes/productRoutes");
const userRoutes = require("./routes/userRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const apiLimiter = require("./middleware/rateLimiter");

const app = express();

app.use("/uploads", express.static("uploads"));

const cors = require("cors");
app.use(
  cors({
    origin: "http://localhost:3000", // Allow only the frontend origin to access the resources
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);

connectDB();

app.use(bodyParser.json());

app.use("/api/auth", apiLimiter, authRoutes);
app.use("/api/cart", apiLimiter, cartRoutes);
app.use("/api/orders", apiLimiter, orderRoutes);
app.use("/api/products", apiLimiter, productRoutes);
app.use("/api/users", apiLimiter, userRoutes);
app.use("/api/payment", apiLimiter, paymentRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to your API!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
