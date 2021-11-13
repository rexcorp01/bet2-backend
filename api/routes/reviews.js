const express = require("express");
const router = express.Router();
const controllers = require("../controllers");
const reviews = controllers.reviews
const middleware = require("../middleware/authorize");

router.route("/by/:id").get(reviews.getReviewById);
router.route("/create").post(reviews.createReview)
router.route("/all/to/user/:id").get(reviews.getAllReviewsToUserId);
router.route("/all/from/user/:id").get(reviews.getReviewFromUserId);
router.route("/all").get(reviews.getAllReviews);

router.use(middleware.checkToken);
// router.route("/delete").delete(reviews.deleteMessageById);
router.route("/delete").post(reviews.deleteMessageById);



module.exports = router;
