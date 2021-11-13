const express = require("express");
const router = express.Router();
const controllers = require("../controllers");
const auth = controllers.auth;
const middleware = require("../middleware/authorize");
const rateLimit = require("express-rate-limit");

const createAccountLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour window
  max: 5, // start blocking after 5 requests
  message:
    "Too many requests made from this IP, please try again after an hour",
});

// router.use(middleware.checkToken)

router.route("/login").post(auth.login);

router.route("/admin/login").post(auth.adminLogin);

router.route("/signup").post(auth.signup);

router
  .route("/passcode/request")
  .post(middleware.checkToken, auth.sendTwilioAccessCode);

router
  .route("/passcode/verify")
  .post(
    createAccountLimiter,
    middleware.checkToken,
    auth.verifyTwilioAccessCode
  );

router.route("/forgot/password").post(auth.sendForgotPasswordToken);

router
  .route("/device/verify/token")
  .get(auth.checkUserAgentAndVerifyPasswordToken);

router
  .route("/reset/password/:userId")
  .post(createAccountLimiter, middleware.checkToken, auth.resetPassword);

router
  .route("/change/password")
  .post(
    createAccountLimiter,
    middleware.checkToken,
    auth.changePasswordWithVerifyOldPassword
  );

module.exports = router;
