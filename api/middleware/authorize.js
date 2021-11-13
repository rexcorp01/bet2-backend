const User = require("../models/users");
const models = require("../models");
const jwt = require("jsonwebtoken");
const Promise = require("bluebird");
const jwtPromise = Promise.promisifyAll(require("jsonwebtoken"));
const SECRET = process.env.JWT_SECRET;
const errorHandler = require("../errors/handlers").errorHandler;



let checkToken = async (req, res, next) => {
  try {
    let token = req.headers["x-access-token"] || req.headers["authorization"]; // Express headers are auto converted to lowercase
    //bellow code is for testing apis: send headers Key: AUTHORIZATION_TOKEN found in ENV
    let bearerToken = token;
    if (bearerToken == process.env.AUTHORIZATION_TOKEN) {
      return next();
    } //end testing
    if (token) {
      jwt.verify(token, SECRET, (err, decoded) => {
        if (!decoded) {
          return res.status(404).send("user not found");
        }

        let user = decoded.user || decoded.data || decoded.id;

       models.users.findOne({ _id: user }).then((enteredUser) => {
          if (!enteredUser)
            return res.status(404).send("user not found in token");
        });

        if (err) {
          return res.json({
            success: false,
            message: "Token is not valid",
          });
        } else {
          req.decoded = decoded;
          next();
        }
      });
    } else {
      res
        .status(400)
        .send({ success: false, message: "Auth token is not supplied" });
    }
  } catch (error) {
    let resp = errorHandler(error, res);
    return resp;
  }
};

module.exports = {
  checkToken,
};
