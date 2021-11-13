const { NODE_ENV, TWILIO_ACCOUNT_SID, TWILIO_KEY, TWILIO_PHONE } = process.env;

// const client = require("twilio")(TWILIO_ACCOUNT_SID, TWILIO_KEY);

// const twilio = {
//   sid: process.env.TWILIO_ACCOUNT_SID || "",
//   authToken: process.env.TWILIO_AUTH_TOKEN || "",
//   number: process.env.TWILIO_NUMBER,
//   verifySid: process.env.TWILIO_VERIFY_SID,
//   // authyToken: process.env.AUTHY_API_TOKEN || "",
// };

module.exports = {
  sendPasscode: (userNumber, passcode) => {
    if (!passcode) {
      return Promise.resolve("Must include passcode");
    }
    if (NODE_ENV === "testing") {
      return Promise.resolve("Testing so pass through");
    }
    if (userNumber[0] !== "+") {
      return Promise.reject("Phone must include country code");
    }
    const message = {
      to: userNumber,
      from: TWILIO_PHONE,
      body: `Your AutoMojo Verification Code is: ${passcode}`,
    };
    return client.messages.create(message);
  },

  sendInvite: (userNumber, email, password) => {
    if (NODE_ENV === "testing") {
      return Promise.resolve("Testing so pass through");
    }
    if (userNumber[0] !== "+") {
      return Promise.reject("Phone must include country code");
    }
    const message = {
      to: userNumber,
      from: TWILIO_PHONE,
      body: `You have been invited on AutoMojo. Please download the app 'AutoMojo App link'`,
    };
    return client.messages.create(message);
  },

  sendVerificationCode: async (number) => {
    try {
      if (!number)
        return {
          success: false,
          message: "A mobile phone number is required.",
        };
      const verificationRequest = await client.verify
        .services(twilio.verifySid)
        .verifications.create({ to: `${number}`, channel: "sms" });

      return verificationRequest;
    } catch (err) {
      throw new Error(err);
    }
  },

  checkVerificationCode: async (number, code, user) => {
    try {
      if (!number)
        return {
          success: false,
          message: "A mobile phone number is required.",
        };
      if (!code)
        return {
          success: false,
          message: "A verification code is required.",
        };

      const verified = await client.verify
        .services(twilio.verifySid)
        .verificationChecks.create({ code, to: `+1${number}` });
      console.log("verified:", verified);

      if (verified && verified.status === "approved") {
        return {
          success: true,
          message: "Phone number verified.",
        };
      }

      return {
        success: false,
        message: "Phone number not verified.",
      };
    } catch (err) {
      return {
        success: false,
        message: err,
      };
    }
  },
};
