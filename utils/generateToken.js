const jwt = require("jsonwebtoken");

const generateToken = (tokenPayload) => {
  return jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: "10d" });
};

module.exports = generateToken;
