const express = require("express");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");

const router = express.Router();

router.post("/singup", authController.singup);
router.post("/login", authController.login);
router.get("/logout", authController.logout);

//all the routes after that is going to use the auth.protected
router.use(authController.protect);

router.patch("/updateMyPassword", authController.updatePassword);
router.get("/me", userController.getMe, userController.getUser);
router.patch("/updateMe", userController.updateMe);
router.delete("/deleteMe", userController.deleteMe);

//all the routes after that is going to be available only for admin user
router.use(authController.restrictTo("admin"));

router.route("/").get(userController.getAllUsers);
router.route("/:id").get(userController.getUser).patch(userController.updateUser).delete(userController.deleteUser);

module.exports = router;
