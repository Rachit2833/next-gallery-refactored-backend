const mongoose = require("mongoose")
const labelSchema = new mongoose.Schema(
  {
    label: {
      type: String,
      required: true,
    },
    descriptors: {
      type: [[Number]], // Array of arrays of Numbers
      required: true,
    },
    userId: { type: String, required: true },
  },
  {
    collection: "Labels", // Specify the collection name
  }
);
const Label = mongoose.model("Labels", labelSchema);
module.exports= Label