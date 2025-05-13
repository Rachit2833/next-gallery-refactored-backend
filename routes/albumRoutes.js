const express = require("express")

const { getAllAlbum, addNewAlbum, addImageToAlbum, getAlbumById, deleteAlbum, getAlbumImages, generateLinkAlbum } = require("../controller/albumController")
const { searchThrottle } = require("../middleware/imageMiddleWare")
const { upFun, uploadToStorage } = require("../controller/imageController")
const router= express.Router()
router.route("/").get(getAllAlbum).post(upFun,uploadToStorage,addNewAlbum).patch(addImageToAlbum)
router.route("/share").post(generateLinkAlbum);
router.route("/share/save").post(addNewAlbum);
router.route("/:id").get(getAlbumById).delete(deleteAlbum).post(addImageToAlbum);
router.route("/images/:id").get(getAlbumImages)
module.exports=router