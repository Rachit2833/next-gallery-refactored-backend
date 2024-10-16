const express = require("express");
const router = express.Router()
const { deleteLabel,getAllLabels,addNewLabel, getLabelByName,} = require("../controller/labelController")
const {addNewLabelMiddleware}=require("../middleware/labelMiddleWare")
router.route("/labels")
.get(getAllLabels)
.post(addNewLabelMiddleware,addNewLabel)
.delete(deleteLabel)
router.route("/labels/:name").get(getLabelByName)
module.exports = router