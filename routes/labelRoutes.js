const express = require("express");
const router = express.Router()
const { deleteLabel,getAllLabels,addNewLabel, getLabelByName, updateLabel, getLabelById,} = require("../controller/labelController")
const {addNewLabelMiddleware}=require("../middleware/labelMiddleWare");

router.route("/labels")
.get(getAllLabels)
.post(addNewLabelMiddleware,addNewLabel)
.delete(deleteLabel)
router.route("/labels/:name")
.get(getLabelByName)
router.route("/label/:id")
.get(getLabelById)
.patch(updateLabel)
module.exports = router