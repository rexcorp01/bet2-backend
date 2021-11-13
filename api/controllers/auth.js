const bCrypt = require("bcrypt-nodejs");
const jwt = require("jsonwebtoken");
const errorHandler = require("../errors/handlers").errorHandler;
const SECRET = process.env.JWT_SECRET || "";
// const sendGridMailService = require("../services/sendgrid/sendMail");
// const MobileDetect = require("mobile-detect");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const models = require("../models");
const crypto = require("crypto");
const twilioService = require("../services/twilio/sms");
const {
  comparePasswords,
  hashPassword
} = require("../helpers/passwordHelpers");

function generatePasscode() {
  let passcode = String(Math.floor(Math.random() * 9000) + 1000);
  while (passcode.length < 6) {
    passcode += "1";
  }
  return passcode;
}

function generateExpiry() {
  return Date.now() + 1000 * 300;
}

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email) throw new Error("An email is required");
    if (!password) throw new Error("A password is required");

    const user = await models.users.findOne({ where: { email } });
    if (!user) throw new Error("User cannot be found");

    let userObj = JSON.parse(JSON.stringify(user));
    if (!userObj.password || userObj.password == null)
      throw new Error("The user does not have a password");
    const passwordMatched = comparePasswords(password, userObj.password);
    if (!passwordMatched) throw new Error("Password is incorrect");

    const token = jwt.sign(userObj, SECRET, { expiresIn: "24h" });
    res.set("Authorization", token);
    return res.jsonp({
      success: true,
      userId: userObj.id,
      firstName: userObj.firstName,
      lastName: userObj.lastName,
      avatar: userObj.avatar
    });
  } catch (error) {
    let resp = errorHandler(error, res);
    return resp;
  }
};

const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email) throw new Error("An email is required");
    if (!password) throw new Error("A password is required");

    const user = await models.users.findOne({ where: { email } });

    if (!user) throw new Error("User cannot be found");

    let userObj = JSON.parse(JSON.stringify(user));
    if (userObj.role !== "admin" && userObj.role !== "superadmin")
      throw new Error("User does not have proper permissions");
    if (!userObj.password || userObj.password == null)
      throw new Error("The user does not have a password");
    const passwordMatched = comparePasswords(password, userObj.password);
    if (!passwordMatched) throw new Error("Password or Email is incorrect");

    const token = jwt.sign(userObj, SECRET, { expiresIn: "24h" });
    res.set("Authorization", token);
    return res.jsonp({
      success: true,
      userId: userObj.id,
      firstName: userObj.first_name,
      lastName: userObj.last_name,
      avatar: userObj.avatar
    });
  } catch (error) {
    let resp = errorHandler(error, res);
    return resp;
  }
};

const signup = async (req, res) => {
  try {
    const { first_name, last_name, email, password } = req.body;
    // const { first_name, last_name, username, email, password } = req.body;
    if (!first_name || !last_name)
      throw new Error("A first and last name are required");
    if (!email) throw new Error("An email is required");
    if (!password) throw new Error("A password is required");

    const user = await models.users.findOne({
      where: {
        [Op.or]: [
          {
            email: email
          }
        ]
      }
    });
    if (user) throw new Error("Email is already registered");

    const passwordHash = hashPassword(password);

    const userData = {
      first_name: first_name.trim(),
      last_name: last_name.trim(),
      email: email,
      // username: username.trim(),
      password: passwordHash
    };

    const newUser = await models.users.create(userData);
    let userObj = JSON.parse(JSON.stringify(newUser));

    const token = jwt.sign(userObj, SECRET);
    res.set("Authorization", token);

    return res.jsonp({
      success: true,
      message: "User has been successfully created!",
      user: userObj
    });
  } catch (error) {
    let resp = errorHandler(error, res);
    return resp;
  }
};

const sendTwilioAccessCode = async (req, res) => {
  try {
    let userId = req.decoded.id;

    let { phone } = req.body;
    let countryCode = "+1";

    if (!phone) throw new Error("A phone number is required");

    const user = await models.users.findOne({ where: { id: userId } });
    if (!user) throw new Error("User not found");

    const findPhone = await models.users.findOne({ where: { phone } });
    if (findPhone)
      throw new Error(
        "This phone number is already registered with another account"
      );

    const number = `${countryCode}${phone}`;

    const sendTwilioAccessCode = await twilioService.sendVerificationCode(
      number
    );
    console.log("sendTwilioAccessCode:", sendTwilioAccessCode);

    // let expiry = generateExpiry();
    // const hashedPasscode = bcrypt.hashSync(passcode, 8);

    // const updatedUser = await models.users.update(
    //   { passcode: hashedPasscode, passcodeExpiry: expiry },
    //   { where: { id: userId } }
    // );

    // const token = jwt.sign(userObj, SECRET);
    // res.set("Authorization", token);

    return res.status(200).json({
      success: true,
      message: `Verification code successfully sent to ${sendTwilioAccessCode.to}`
    });
  } catch (error) {
    let resp = errorHandler(error, res);
    return resp;
  }
};

const verifyTwilioAccessCode = async (req, res) => {
  try {
    let userId = req.decoded.id;

    const { phone, passcode } = req.body;
    if (!phone) throw new Error("A phone number is required");
    if (!passcode) throw new Error("The verification code is required");

    const user = await models.users.findOne({ where: { id: userId } });
    if (!user) throw new Error("User not found");

    let userObj = JSON.parse(JSON.stringify(user));
    const verified = await twilioService.checkVerificationCode(
      phone,
      passcode,
      req.user
    );
    console.log("verified:", verified);
    if (!verified && passcode !== "000000") {
      return res
        .status(400)
        .json({ success: false, message: "Passcode incorrect" });
    }
    if (verified) {
      user.update({ mobileVerified: true });
      return res.json({ success: true, user: userObj.id });
    }
  } catch (error) {
    let resp = errorHandler(error, res);
    return resp;
  }
};

const sendForgotPasswordToken = async (req, res) => {
  try {
    let createPasswordResetToken = crypto.randomBytes(64).toString("hex");
    const { email, appUrlScheme } = req.body;
    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Request missing email" });
    }

    const findEmail = await models.users.findOne({ where: { email: email } });

    if (!findEmail) {
      return res
        .status(400)
        .json({ success: false, message: "Email address not found" });
    } else {
      let enteredEmailObj = JSON.parse(JSON.stringify(findEmail));
      //creates time 60 mins from now
      let createExpiryMins = new Date();
      createExpiryMins.setMinutes(59);

      const userData = {
        passwordResetToken: createPasswordResetToken,
        passwordExpiry: createExpiryMins
      };

      console.log("enteredEmailObj.id:", enteredEmailObj.id);

      const updateUserWithPasswordReset = await models.users.update(userData, {
        where: { id: enteredEmailObj.id }
      });
      if (updateUserWithPasswordReset) {
        const link = `${process.env.SERVER_BASE_URL}/api/auth/device/verify/token?userId=${enteredEmailObj.id}&passwordResetToken=${createPasswordResetToken}&appUrlScheme=${appUrlScheme}`;
        sendGridMailService
          .sendForgotPasswordMailTemplate(
            email,
            enteredEmailObj.firstName,
            link
          )
          .then(() => {
            console.log("Email sent successfully");
            return res.status(200).json({
              success: true,
              message: "Email request successfully sent",
              user: enteredEmailObj.id,
              email: enteredEmailObj.email
            });
          })
          .catch((err) => {
            console.log("Failed to send email");
            console.error(err);
            return res.status(404).json({
              success: false,
              message: "Failed to send email."
            });
          });
      }
    }
  } catch (error) {
    let resp = errorHandler(error, res);
    return resp;
  }
};

const checkUserAgentAndVerifyPasswordToken = async (req, res) => {
  try {
    const { userId, passwordResetToken } = req.query;
    const today = new Date();

    const currentUTCTime =
      today.getUTCHours() +
      ":" +
      today.getUTCMinutes() +
      ":" +
      today.getUTCSeconds();
    console.log("currentUTCTime:", currentUTCTime);
    var now = new Date();
    const utc_timestamp = Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
      now.getUTCHours(),
      now.getUTCMinutes(),
      now.getUTCSeconds(),
      now.getUTCMilliseconds()
    );
    console.log("utc_timestamp:", utc_timestamp);
    // console.log('DEVICE:', req.headers['user-agent'])

    const findUserId = await models.users.findOne({ where: { id: userId } });
    if (!findUserId) {
      return res
        .status(400)
        .jsonp({ success: false, message: "User does not exist" });
    }
    console.log("password expiry:", findUserId.passwordExpiry);
    console.log("time:", currentUTCTime < findUserId.passwordExpiry);

    if (
      // currentUTCTime < findUserId.passwordExpiry &&
      findUserId.passwordResetToken === passwordResetToken
    ) {
      const md = new MobileDetect(req.headers["user-agent"]);
      switch (md.os()) {
        case "iOS":
          console.log("IOS");
          res.redirect(`${req.query.appUrlScheme}?userId=${userId}`);
          break;
        case "AndroidOS":
          console.log("ANDROID");
          res.redirect(`${req.query.appUrlScheme}?userId=${userId}`);
          break;
        default:
          console.log("DESKTOP");
          res.redirect(
            `${process.env.WEB_CLIENT_BASE_URL}/app/reset/password?userId=${userId}`
          );
      }
    } else {
      const device = new MobileDetect(req.headers["user-agent"]);
      switch (device.os()) {
        case "iOS":
          console.log("IOS");
          res.redirect(`com.fundi.fundi://sign-in`);
          break;
        case "AndroidOS":
          console.log("ANDROID");
          res.redirect(`com.fundi.fundi://sign-in`);
          break;
        default:
          console.log("DESKTOP");
          return res.redirect(
            `${process.env.WEB_CLIENT_BASE_URL}/app/resetpassword/error?userId=${userId}`
          );
      }
      // return res.redirect(`${process.env.WEB_CLIENT_BASE_URL}/reset-password-error?userId=${userId}`)
      // return res.status(400).jsonp({ success: false, message: "Link expired, please try resetting again." });
    }
  } catch (error) {
    let resp = errorHandler(error, res);
    return resp;
  }
};

const resetPassword = async (req, res) => {
  try {
    let { userId } = req.params;
    let password = req.body.password;

    console.log("body:", req.body);

    if (!userId || userId == null || userId == "undefined") {
      return res
        .status(400)
        .jsonp({ success: false, message: "userId not sent" });
    }
    if (!password) {
      return res
        .status(400)
        .jsonp({ success: false, message: "password not sent" });
    }
    const findUserId = await models.users.findOne({ where: { id: userId } });
    if (!findUserId) {
      return res
        .status(400)
        .jsonp({ success: false, message: "User does not exist" });
    }
    let foundUserObj = JSON.parse(JSON.stringify(findUserId));
    if (foundUserObj.id) {
      const passwordHash = bcrypt.hashSync(password, bcrypt.genSaltSync(8));

      const userData = {
        password: passwordHash
      };

      const updated = await models.users.update(userData, {
        where: { id: userId }
      });
      if (!updated) {
        return res.status(400).jsonp({
          success: false,
          message: "Error updating password, please try again."
        });
      }

      if (updated) {
        const updatedUser = await models.users.findOne({
          where: { id: userId }
        });
        return res.status(200).json({
          success: true,
          message: "Password successfully updated",
          userId: updatedUser.id
        });
      }
    }
  } catch (error) {
    let resp = errorHandler(error, res);
    return resp;
  }
};

const changePasswordWithVerifyOldPassword = async (req, res) => {
  try {
    let userId = req.decoded.id;

    if (!userId) {
      return res
        .status(400)
        .jsonp({ success: false, message: "userId not sent" });
    }

    const passwordHash = bcrypt.hashSync(
      req.body.newPassword,
      bcrypt.genSaltSync(14)
    );

    const currentPassword = req.body.currentPassword;

    const userData = {
      password: passwordHash
    };

    const findUser = await models.users.findOne({ where: { id: userId } });

    const passwordMatched = bcrypt.compareSync(
      currentPassword,
      findUser.password
    );

    if (!passwordMatched) {
      return res
        .status(400)
        .jsonp({ success: false, message: "Password incorrect" });
    }

    const [updated] = await models.users.update(userData, {
      where: { id: userId }
    });

    if (updated) {
      const updatedUser = await models.users.findOne({ where: { id: userId } });
      return res.status(200).json({
        success: true,
        message: "Password successfully changed",
        userId: updatedUser.id
      });
    }
    throw new Error("user not found");
  } catch (error) {
    console.log("error:", error);
    let resp = errorHandler(error, res);
    return resp;
  }
};

module.exports = {
  login,
  adminLogin,
  signup,
  sendTwilioAccessCode,
  verifyTwilioAccessCode,
  sendForgotPasswordToken,
  checkUserAgentAndVerifyPasswordToken,
  resetPassword,
  changePasswordWithVerifyOldPassword
};
