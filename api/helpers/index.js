const Jwt = require("jsonwebtoken");
const Config = require("../config");

const sixDigitCode = () => {
  let code = "";
  const alphanum = "0123456789";
  for (let i = 0; i < 4; i++) {
    const randomIdx = Math.floor(Math.random() * alphanum.length);
    const randomChar = alphanum[randomIdx];
    code += randomChar;
  }
  return code;
};

const verifyPassword = (password) => {
  const eightChar = new RegExp("^(?=.{8,})"),
    upper = new RegExp("^(?=.*[A-Z])"),
    numerical = new RegExp("^(?=.*[0-9])");
  if (
    eightChar.test(password) &&
    upper.test(password) &&
    numerical.test(password)
  ) {
    return true;
  }

  return false;
};

module.exports = {
  sixDigitCode,
  verifyPassword,
};
