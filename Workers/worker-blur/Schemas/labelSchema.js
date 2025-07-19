import mongoose from "mongoose";

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
    blurredImage: {
      type: String,
      required: true,
    },
    ImageUrl: String,
  },
  {
    collection: "Labels", // Specify the collection name
  }
);

const Label = mongoose.model("Label", labelSchema);

export default Label;
