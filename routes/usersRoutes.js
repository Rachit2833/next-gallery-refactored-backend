const express = require("express");
const { getSearchUser } = require("../controller/userController");
const { createNewUser, login, protect, verifyUser } = require("../controller/authController");
const router= express.Router()

router.route("/searchPeople").get(getSearchUser);
router.route("/").post(createNewUser)
router.route("/login").post(login)
router.route("/verify-user").post(verifyUser)
module.exports = router;