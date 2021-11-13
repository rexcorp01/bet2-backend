const express = require("express");
const router = express.Router();
const controllers = require("../controllers");
const user = controllers.user;
const middleware = require("../middleware/authorize");
const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");
const path = require("path");

// const s3 = new aws.S3({
//   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   region: process.env.AWS_REGION,
// });

// const s3UploadImages = multer({
//   storage: multerS3({
//     s3: s3,
//     contentType: multerS3.AUTO_CONTENT_TYPE,
//     bucket: process.env.S3_BUCKET_AVATAR,
//     acl: "public-read",
//     metadata: function (req, file, cb) {
//       cb(null, { fieldName: file.fieldname });
//     },
//     key: function (req, file, cb) {
//       cb(
//         null,
//         `images/` + Date.now().toString() + path.extname(file.originalname)
//       );
//     },
//   }),
// });

router.use(middleware.checkToken);

router.route("/all").get(user.getAllUsers);
router.route("/all/customers").get(user.getAllCustomers);

router.route("/all/wizards").get(user.getAllWizards);
router.route("/all/deactivated").get(user.getAllDeactivated);


router.route("/self").get(user.getUserSelf)
router.route("/self").put(user.updateMyUser);
router.route("/details/:id").get(user.getUserById);
router.route("/my/account").get(user.getMyAccount);
// router.route("/avatar").put(
  // s3UploadImages.single("avatar"),
  // user.updateAvatar
// );
router.route("/update").put(user.updateUserById);

module.exports = router;
