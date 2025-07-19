const express = require("express")
const { addNewImage,  getAllImages, getAllImagesForLocation, getAllLocations, test, getImageById, deleteImage, setAndUnsetFavourite, searchImages, upFun,uploadToStorage,deleteAllImages, generateLink, getLinkData, duplicateImages, getAllFavouriteImages, massUpload, upload} = require("../controller/imageController.js")
 const {autoShareEnabled, getShareImages, deleteImageFromYou}= require("../controller/shareController")
const {  searchThrottle } = require("../middleware/imageMiddleWare")
const { blurQueue } = require("../lib/blur-queue.js")
const router = express.Router()
router.route("/mass").post(upload.array("images"),massUpload).get((req,res)=>{
     return res.status(200).json({ mes:"Success" });
})
router.route("/blur").get((req,res)=>{
  blurQueue.add("Blur Generator", {
      type: "Image",
      _id: "674b27521197853c86f9ced6",
      ImageUrl: "https://hwhyqxktgvimgzmlhecg.supabase.co/storage/v1/object/public/Images2.0/Rachit2833-1750819518826.png"
    })
   return res.status(200).json({ mes:"Success" });
})
router.route("/").get(getAllImages).post(upFun,uploadToStorage,addNewImage).delete(deleteImage)
router.route("/all").delete(deleteAllImages)
router.route("/favourite").get(getAllFavouriteImages)
router.route("/share").post(generateLink).get(getLinkData)
router.route("/share/images").post(duplicateImages)
router.route("/location").get(getAllLocations);
router.route("/search").get(searchImages);
router.route("/loc").get(getAllImagesForLocation);
router.route("/friend/share").get(getShareImages).delete(deleteImageFromYou);
router.route("/upload").post(upFun,uploadToStorage,(req,res)=>{
 return res.status(200).json({ mes:"Success" });
});
router.route("/:id").get(getImageById).patch(setAndUnsetFavourite);
module.exports = router
