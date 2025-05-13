const express = require("express")
const { addNewImage,  getAllImages, getAllImagesForLocation, getAllLocations, test, getImageById, deleteImage, setAndUnsetFavourite, searchImages, upFun,uploadToStorage,deleteAllImages, generateLink, getLinkData, duplicateImages} = require("../controller/imageController")
 const {autoShareEnabled, getShareImages, deleteImageFromYou}= require("../controller/shareController")
const {  searchThrottle } = require("../middleware/imageMiddleWare")
const router = express.Router()
router.route("/").get(getAllImages).post(upFun,uploadToStorage,addNewImage).delete(deleteImage)
router.route("/all").delete(deleteAllImages)
router.route("/share").post(generateLink).get(getLinkData)
router.route("/share/images").post(duplicateImages)
router.route("/location").get(getAllLocations);
router.route("/search").get(searchImages);
router.route("/loc").get(getAllImagesForLocation);
router.route("/share").get(getShareImages).post(autoShareEnabled).delete(deleteImageFromYou);
router.route("/upload").post(upFun,uploadToStorage,(req,res)=>{
 return res.status(200).json({ mes:"Success" });
});
router.route("/:id").get(getImageById).patch(setAndUnsetFavourite);
module.exports = router
