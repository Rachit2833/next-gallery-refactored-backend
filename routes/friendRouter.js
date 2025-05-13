const express= require("express")
const { getAllFriends, verifyAutoSend, updateAutoSend } = require("../controller/friendsController")
const Relation = require("../Schema/relationSchema")
const router= express.Router()
router.route("/").get(getAllFriends)
router.route("/verify").get(verifyAutoSend)
router.route("/autoSend").patch(updateAutoSend)

module.exports = router;