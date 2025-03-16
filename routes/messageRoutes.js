const express = require("express");
const {
  sendMessage,
  getAllMessages,
  addGroup,
  deleteGroup,
  getAllGroups,
  updateGroup,
  sendGroupMessage,
  getAllMessagesNew,
} = require("../controller/messageController");
const { uploadToStorage, upFun, test2 } = require("../controller/imageController");
const router = express.Router()
router.route("/").post(sendMessage).get(getAllMessagesNew)
router.route("/new").get(getAllMessagesNew)
router
  .route("/group")
  .post(upFun,uploadToStorage,addGroup)
  .delete(deleteGroup)
  .get(getAllGroups)
  .patch(updateGroup);
router.route("/group/message").post(sendGroupMessage)
module.exports=router