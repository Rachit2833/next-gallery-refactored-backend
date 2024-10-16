const express = require("express")
const { addNewImage } = require("../controller/imageController")
const { addNewImageMiddleware } = require("../middleware/imageMiddleWare")

const router = express.Router()
router.route("/")
.post(addNewImageMiddleware,addNewImage)
module.exports = router