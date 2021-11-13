const jwt = require("jsonwebtoken");
const SECRET = process.env.JWT_SECRET;

module.exports = (id) => {
  return jwt.sign({ id }, SECRET, { expiresIn: "2d" });
};
