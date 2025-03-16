const express= require("express")
const { getAllFriends } = require("../controller/friendsController")
const Relation = require("../Schema/relationSchema")
const router= express.Router()
router.route("/").get(getAllFriends)

module.exports = router;