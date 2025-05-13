const mongoose = require("mongoose");

const relationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  friendId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    required: true,
  },
  autoSend: {
    userId: {
      enabled: { type: Boolean, default: false },
      descriptorId: { type: mongoose.Schema.Types.ObjectId, default: null },
    },
    friendId: {
      enabled: { type: Boolean, default: false },
      descriptorId: { type: mongoose.Schema.Types.ObjectId, default: null },
    },
  },
  createdAt: { type: Date, default: Date.now },
});

const Relation = mongoose.model("Relation", relationSchema, "Relations");
module.exports = Relation;
