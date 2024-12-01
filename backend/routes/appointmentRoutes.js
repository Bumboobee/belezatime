const express = require("express");
const authController = require("../controllers/authController");
const appointmentController = require("../controllers/appointmentController");

const router = express.Router();

router.use(authController.protect);
router.route("/").get(appointmentController.getAllAppointments).post(appointmentController.createAppointment);
router.route("/:id").get(appointmentController.getAppointment).patch(appointmentController.updateAppointment);
router.route("/info/servicesSpentByUser").get(appointmentController.getServicesSpentByUser);

router.use(authController.restrictTo("admin"));
router.route("/info/weeklyMetrics").get(appointmentController.getWeeklyMetrics);
router.route("/info/yearlyStats").get(appointmentController.getYearlyStats);
router.route("/:id").delete(appointmentController.deleteAppointment);

module.exports = router;
