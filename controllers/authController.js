// controllers/authController.js
const bcrypt = require("bcrypt");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  const { username, email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({
    username,
    email,
    password: hashedPassword,
  });

  await user.save();

  res.status(201).json({
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      admin: user.admin,
    },
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  console.log("Login attempt:", email); // Log email

  try {
    const user = await User.findOne({ email, banned: false });
    console.log("User found:", user); // Log user

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password match:", isMatch); // Log password match result

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, isAdmin: user.admin },
      process.env.JWT_SECRET,
      { expiresIn: "1h", issuer: "yourdomain.com", audience: user.email }
    );
    console.log("Token generated:", token); // Log token

    res.status(200).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        admin: user.admin,
        banned: user.banned,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { register, login };

module.exports = { register, login };
