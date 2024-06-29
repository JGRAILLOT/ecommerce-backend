// routes/userRoutes.js
const express = require("express");
const {
  getUsers,
  getUserProfile,
  updateUserProfile,
  deleteUser,
} = require("../controllers/userController");

const router = express.Router();

// Use adminAuth middleware for all admin routes to ensure the user is an admin
router.get("/", getUsers);
router.get("/profile/:id", getUserProfile);
router.put("/profile/:id", updateUserProfile);
router.delete("/:id", deleteUser);

module.exports = router;
