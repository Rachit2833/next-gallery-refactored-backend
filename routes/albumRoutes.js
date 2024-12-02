const express = require("express")
const { getAllAlbum, addNewAlbum, addImageToAlbum, getAlbumById, deleteAlbum, getAlbumImages } = require("../controller/albumController")
const { searchThrottle } = require("../middleware/imageMiddleWare")
const router= express.Router()
router.route("/").get(getAllAlbum).post(addNewAlbum).patch(addImageToAlbum)
router.route("/:id").get(getAlbumById).delete(deleteAlbum)
router.route("/images/:id").get(getAlbumImages)
module.exports=router