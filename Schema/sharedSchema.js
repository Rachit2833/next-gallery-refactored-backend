const mongoose = require("mongoose");

const SharedSchema = new mongoose.Schema(
  {
    imgId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Image",
      required: true,
    },
    sharedIds: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
      required: true,
    },
  },
  {
    collection: "SharedImages", // Specify the collection name
  }
);

const Share = mongoose.model("Share", SharedSchema);
module.exports = Share;
