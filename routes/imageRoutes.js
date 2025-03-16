const express = require("express")
const { addNewImage,  getAllImages, getAllImagesForLocation, getAllLocations, test, getImageById, deleteImage, setAndUnsetFavourite, searchImages, 
   upFun,
   uploadToStorage
 } = require("../controller/imageController")
const {  searchThrottle } = require("../middleware/imageMiddleWare")
const router = express.Router()
router.route("/").get(getAllImages).post(upFun,uploadToStorage,addNewImage).delete(deleteImage)
router.route("/location").get(getAllLocations);
router.route("/search").get(searchImages);
router.route("/loc").get(getAllImagesForLocation);
router.route("/upload").post(upFun,uploadToStorage,(req,res)=>{
 return res.status(200).json({ mes:"Success" });
});
router.route("/:id").get(getImageById).patch(setAndUnsetFavourite);
module.exports = router
