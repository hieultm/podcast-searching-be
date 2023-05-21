import {
  getUserProfile,
  updateProfile,
  searchUserByUsername,
  getOtherUserProfile,
} from "../../controllers/auth/userController";
const router = require("express").Router();
const multer = require("multer");
const { storageImg } = require("../../config/cloudinary");
const uploadAvatar = multer({ storage: storageImg });

//user

router
  .route("/profile/:id")
  .get(getUserProfile)
  .put(uploadAvatar.single("avatar"), updateProfile);

router.route("/recent_searches").get(searchUserByUsername);

router.route("/other_profile").get(getOtherUserProfile);

module.exports = router;
