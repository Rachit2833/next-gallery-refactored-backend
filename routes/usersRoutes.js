const express = require("express");
const { getSearchUser, updateUserImage, updateAvatarImage } = require("../controller/userController");
const { createNewUser, login, protect, verifyUser } = require("../controller/authController");
const { upFun, uploadToStorage } = require("../controller/imageController");
const uploadFile = require("../upload");
const router= express.Router()


router.route("/").post(createNewUser)
router.route("/login").post(login)
router.route("/verify-user").post(verifyUser)
router.route("/:id").patch(upFun,uploadToStorage,updateUserImage)
router.route("/avatarUpdate/:id").patch(updateAvatarImage)
module.exports = router;