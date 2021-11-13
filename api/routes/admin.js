const express = require("express");
const router = express.Router();
const controllers = require("../controllers");
const { admin, calls, user, report, category, reviews } = controllers;
const middleware = require("../middleware/authorize");
// const {
//   sendVerificationCode,
//   checkVerificationCode,
// } = require("../services/twilio.service");
// const aws = require('aws-sdk')
// const multer = require('multer')
// const multerS3 = require('multer-s3')
// const path = require("path");

// const s3 = new aws.S3({
//   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   region: process.env.AWS_REGION
// })

// const s3UploadImages = multer({
//   storage: multerS3({
//     s3: s3,
//     contentType: multerS3.AUTO_CONTENT_TYPE,
//     bucket: process.env.S3_BUCKET_AVATAR,
//     acl: "public-read",
//     metadata: function (req, file, cb) {
//       cb(null, {fieldName: file.fieldname});
//     },
//     key: function (req, file, cb) {
//       cb(null, `images/` + Date.now().toString() + path.extname(file.originalname))
//     }
//   })
// })

router.use(middleware.checkToken);

// router.route('/create')
// .post(s3UploadImages.single("avatar"), admin.createAdminAccount)


// router.route("admin/by/:id").get(admin.getReviewsById);


router.route("/users/admins/all").get(admin.getAllAdmins);
router.route("/users/admins/by/:id").get(admin.getAdminById)
router.route("/update").put(admin.updateOtherAdmins);

router.route("/users/by/:id").get(user.getUserById);
router.route("/users/update/by/:id").put(user.updateUserById);
router.route("/users/customers/all").get(user.getAllCustomers);
router.route("/users/wizards/all").get(user.getAllWizards);
router.route("/users/deactivated/all").get(user.getAllDeactivated);
router.route("/users/deactivate/by/:id").put(user.deactivateUserById);
router.route("/users/reactivate/by/:id").put(user.reactivateUserById);


router.route("/report/customers/total").get(report.getTotalCustomers);
router.route("/report/customers/by/date").get(report.getCustomersByDate);
router.route("/report/wizards/total").get(report.getTotalWizards);
router.route("/report/wizards/by/date").get(report.getWizardsByDate);
router.route("/report/calls/total").get(report.getTotalCalls);
router.route("/report/calls/total/revenue").get(report.getTotalCallsRevenue);
router.route("/report/calls/by/date").post(report.getCallsByDate);

module.exports = router;
