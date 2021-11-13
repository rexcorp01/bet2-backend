const bcrypt = require("bcrypt-nodejs");

exports.comparePasswords = (password, savedPassword) => {
  const matched = bcrypt.compareSync(password, savedPassword);
  return matched;
};

exports.hashPassword = (password) => {
  const hash = bcrypt.hashSync(password, bcrypt.genSaltSync(8));
  return hash;
};
