const User = require("../models/user");
const jwt = require("jsonwebtoken");

const getTokenFromHeader = (header) => {
  if (!header) return null;
  const parts = header.split(" ");
  if (parts.length === 2 && parts[0] === "Bearer") return parts[1];
  return null;
};

const verifyUser = async (req, res, next) => {
  const token = getTokenFromHeader(req.header("Authorization"));
  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: "Token is not valid" });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Token is not valid" });
  }
};

const verifyAdmin = async (req, res, next) => {
  const token = getTokenFromHeader(req.header("Authorization"));
  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || !user.admin) {
      return res.status(403).json({ message: "Forbidden: Admin access only" });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Token is not valid" });
  }
};

module.exports = { verifyUser, verifyAdmin };
