const express = require("express")

const { getAllAlbum, addNewAlbum, addImageToAlbum, getAlbumById, deleteAlbum, getAlbumImages, generateLinkAlbum } = require("../controller/albumController")
const { searchThrottle } = require("../middleware/imageMiddleWare")
const { upFun, uploadToStorage, upload } = require("../controller/imageController")
const router= express.Router()
router.route("/").get(getAllAlbum).post(upload.array("images"),addNewAlbum).patch(addImageToAlbum)
router.route("/share").post(generateLinkAlbum);
router.route("/share/save").post(addNewAlbum);
router.route("/:id").get(getAlbumById).delete(deleteAlbum).post(addImageToAlbum);
router.route("/images/:id").get(getAlbumImages)
module.exports=router