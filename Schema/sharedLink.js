const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const sharedLinkSchema = new Schema({
  expireAt: {
    type: Date,
    default: () => new Date(Date.now() + 6 * 60 * 60 * 1000), // 6 hours from now
    required: true,
  },
  imageIds: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Image" }], // Array of ObjectIds
    validate: [arrayLimit, "{PATH} exceeds the limit of 36"],
  },
  albumId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Album",
  },
  inviteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref:"Group"
  },
  sharedById: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
});


sharedLinkSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });

// Custom validator to enforce max length on imageIds
function arrayLimit(val) {
  return val.length <= 36;
}

const SharedLink = mongoose.model("SharedLink", sharedLinkSchema, "Links");

module.exports = SharedLink;
