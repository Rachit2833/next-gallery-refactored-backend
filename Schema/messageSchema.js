const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    messageType: {
      type: String,
      enum: ["text", "image", "video", "audio", "file"],
      default: "text",
    },
    mediaUrl: {
      type: String,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    readAt: {
      type: Date,
    },
    deletedFor: [
      {
        type: mongoose.Schema.Types.ObjectId,
        default:[],
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema,"Message");
module.exports = Message;
