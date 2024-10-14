const express = require("express");
const router = express.Router()
const { deleteLabel,getAllLabels,addNewLabel,} = require("../controller/labelController")

router.route("/labels")
.get(getAllLabels)
.post(addNewLabel)
.delete(deleteLabel)
module.exports = router