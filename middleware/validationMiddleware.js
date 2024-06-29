const { check, validationResult } = require("express-validator");

const validateUser = [
  check("email").isEmail().normalizeEmail(),
  check("password").isLength({ min: 6 }).trim().escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = { validateUser };
