const mongoose = require("mongoose");

// Define the Album schema
const AlbumSchema = new mongoose.Schema(
  {
    ImageUrl: { type: String },
    Name: {
      type: String,
      required: true,
      maxlength: [15, "Name cannot exceed 15 characters"],
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
      default: Date.now,
    },
    People: [{ type: mongoose.Schema.Types.ObjectId, ref: "Label" }],
  },
  {
    collection: "Albums",
  }
);

// Pre-save hook to filter out duplicates
AlbumSchema.pre("save", function (next) {
  const originalLength = this.Images.length;
  const uniqueImages = [...new Set(this.Images.map((id) => id.toString()))];

  const duplicateImagesCount = originalLength - uniqueImages.length;
  const duplicateImages = this.Images.filter(
    (id, index, self) => self.indexOf(id) !== index
  );

  this.Images = uniqueImages.map((id) => mongoose.Types.ObjectId(id)); // Ensure IDs are in ObjectId format

  // Continue saving but send a warning if there were duplicates
  if (duplicateImagesCount > 0) {
    this._duplicateImages = duplicateImages; // Store duplicates temporarily for response
  }
  next();
});

const Album = mongoose.model("Album", AlbumSchema);
module.exports = Album;
