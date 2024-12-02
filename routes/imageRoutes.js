const express = require("express")
const { addNewImage,  getAllImages, getAllImagesForLocation, getAllLocations, test, getImageById, deleteImage, setAndUnsetFavourite } = require("../controller/imageController")
const {  searchThrottle } = require("../middleware/imageMiddleWare")
const router = express.Router()
router.route("/").get(getAllImages).post(addNewImage).delete(deleteImage)
router.route("/location").get(getAllLocations);
router.route("/loc").get(getAllImagesForLocation);
router.route("/:id").get(getImageById).patch(setAndUnsetFavourite);




module.exports = router