const express = require("express");
const router = express.Router();
const controllers = require("../controllers");
const categories = controllers.categories;
const middleware = require("../middleware/authorize");

router.use(middleware.checkToken);

router.route("/all").get(categories.getAllCategories);
router.route("/by/:id").get(categories.getCategoryById);
router.route("/by/title").get(categories.getCategoryByTitle);
router.route("/add").post(categories.addCategory);
router.route("/delete/by/:id").post(categories.deleteCategory);
router.route("/specialty/add").post(categories.addSpecialty);
router.route("/specialty/update").put(categories.updateSpecialty);
router.route("/specialty/delete").post(categories.deleteSpecialty);
router.route("/specialty/by/:id").get(categories.getSpecialtyById);


// THIS ROUTE NEEDS A MULTER FORM-DATA FOR AVATAR
// router.route("/specialty/update").put(categories.updateSpecialty);

module.exports = router;
