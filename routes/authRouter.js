const express = require("express");
const { useLoginTemporary } = require("../controller/authController");

const router =express.Router()
router.route("/").post(useLoginTemporary);
module.exports =router