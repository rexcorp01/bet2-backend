var DataTypes = require("sequelize").DataTypes;
var _call_request_response = require("./call_request_response");
var _call_requests = require("./call_requests");
var _calls = require("./calls");
var _categories = require("./categories");
var _devices = require("./devices");
var _failed_jobs = require("./failed_jobs");
var _jobs = require("./jobs");
var _migrations = require("./migrations");
var _password_resets = require("./password_resets");
var _reviews = require("./reviews");
var _stripe_payment_sources = require("./stripe_payment_sources");
var _stripe_profiles = require("./stripe_profiles");
var _users = require("./users");
var _wizard_category_memberships = require("./wizard_category_memberships");

function initModels(sequelize) {
  var call_request_response = _call_request_response(sequelize, DataTypes);
  var call_requests = _call_requests(sequelize, DataTypes);
  var calls = _calls(sequelize, DataTypes);
  var categories = _categories(sequelize, DataTypes);
  var devices = _devices(sequelize, DataTypes);
  var failed_jobs = _failed_jobs(sequelize, DataTypes);
  var jobs = _jobs(sequelize, DataTypes);
  var migrations = _migrations(sequelize, DataTypes);
  var password_resets = _password_resets(sequelize, DataTypes);
  var reviews = _reviews(sequelize, DataTypes);
  var stripe_payment_sources = _stripe_payment_sources(sequelize, DataTypes);
  var stripe_profiles = _stripe_profiles(sequelize, DataTypes);
  var users = _users(sequelize, DataTypes);
  var wizard_category_memberships = _wizard_category_memberships(sequelize, DataTypes);


  return {
    call_request_response,
    call_requests,
    calls,
    categories,
    devices,
    failed_jobs,
    jobs,
    migrations,
    password_resets,
    reviews,
    stripe_payment_sources,
    stripe_profiles,
    users,
    wizard_category_memberships,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
