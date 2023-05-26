import {
  loginUser,
  registerUser,
  getConfirmationUser,
  changePasswordUser,
} from "../../controllers/auth/authController";
const router = require("express").Router();

//LOGIN
router.route("/login").post(loginUser);

//REGISTER
router.route("/register").post(registerUser);

router.route("/get_confirmation_user").get(getConfirmationUser);
router.route("/change_password_user").post(changePasswordUser);

//   //LOGIN GOOGLE
//   router.route("/google").post(loginGoogle);

module.exports = router;
