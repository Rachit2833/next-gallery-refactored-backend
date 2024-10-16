const mongoose = require("mongoose");
const { collection } = require("./labelSchema");
const ImageLabel = mongoose.Schema(
  {
    ImageUrl: String,
    Location: String,
    Description: {
      type: String,
      maxlength: [15, "Description cannot exceed 15 characters"],
      required: true,
    },
    Date: {
      type: Date,
      default: Date.now, // Automatically set the date to the current date and time
    },
    People: Array,
  },
  {
    collection: "Images", // Specify the collection name
  }
);
const Image = mongoose.model("Images",ImageLabel)
module.exports=Image