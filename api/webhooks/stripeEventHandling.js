// const Order = require("../models/order");
const User = require("../models/user");

exports.subscriptionHandling = async (event) => {
  const dataObject = event.data.object;
  console.log("event.type", event.type);
  console.log("event.data.object", event.data.object);
  switch (event.type) {
    // common subscription event flow
    case "customer.subscription.created":
      return { type: event.type, data: dataObject };
    case "invoice.created":
      return { type: event.type, data: dataObject };
    case "invoice.finalized":
      return { type: event.type, data: dataObject };
    case "payment_intent.created":
      return { type: event.type, data: dataObject };
    case "payment_intent.succeeded":
      return { type: event.type, data: dataObject };
    case "invoice.paid":
      return { type: event.type, data: dataObject };
    // possible events to listen for
    case "customer.subscription.trial_will_end":
      return { type: event.type, data: dataObject };
    case "customer.subscription.updated":
      const user = await User.findOne({
        stripeCustomerId: dataObject.customer,
      });
      user.set({ "subscription.status": dataObject.status });
      await user.save();
      return { type: event.type, data: dataObject };
    case "customer.subscription.deleted":
      return { type: event.type, data: dataObject };
    case "setup_intent.created":
      return { type: event.type, data: dataObject };
    default:
      // Unexpected event type
      console.log(`Unhandled event type ${event.type}.`);
      return `Unhandled event type ${event.type}.`;
  }
};

exports.checkoutHandling = async (event) => {
  const dataObject = event.data.object;
  switch (event.type) {
    // common subscription event flow
    case "checkout.session.completed":
      return { success: true, type: event.type, data: dataObject };
    case "charge.succeeded":
      return { type: event.type, data: dataObject };
    case "payment_intent.succeeded":
      return { success: true, type: event.type, data: dataObject };
    case "payment_intent.created":
      return { type: event.type, data: dataObject };
    case "charge.failed":
      return { type: event.type, data: dataObject };
    case "payment_intent.payment_failed":
      return { type: event.type, data: dataObject };
    default:
      // Unexpected event type
      console.log(`Unhandled event type ${event.type}.`);
      return { type: event.type, data: dataObject };
  }
};
