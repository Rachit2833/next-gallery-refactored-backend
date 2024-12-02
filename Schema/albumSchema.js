const mongoose = require("mongoose");

// Define the Album schema
const AlbumSchema = new mongoose.Schema(
  {
    Name: {
      type: String,
      required: true,
      maxlength: [15, "Name cannot exceed 25 characters"],
    },
    Images: [{ type: mongoose.Schema.Types.ObjectId, ref: "Image" }],
    Location: String,
    Description: {
      type: String,
      default: function () {
        return `Memories from ${new Date().toISOString().split("T")[0]}`;
      },
      maxlength: [25, "Description cannot exceed 25 characters"],
      required: false,
    },
   
    Date: {
      type: Date,
      default: Date.now, // Automatically set the date to the current date and time
    },
    People: [{ type: mongoose.Schema.Types.ObjectId, ref: "Label" }], // Reference to Label collection
  },
  {
    collection: "Albums", // Specify the collection name
  }
);

const Album = mongoose.model("Album", AlbumSchema);
module.exports = Album;
