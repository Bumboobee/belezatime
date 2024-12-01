const express = require("express");
const authController = require("../controllers/authController");
const serviceController = require("../controllers/serviceController");

const router = express.Router();

router.use(authController.protect);

router.route("/").get(serviceController.getAllServices);

router.use(authController.restrictTo("admin"));

router.route("/").post(serviceController.createService);

router
  .route("/:id")
  .get(serviceController.getService)
  .patch(serviceController.updateService)
  .delete(serviceController.deleteService);

module.exports = router;
