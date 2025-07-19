import mongoose from "mongoose";

// Define the Album schema
const AlbumSchema = new mongoose.Schema(
  {
    ImageUrl: { type: String },
    Name: {
      type: String,
      required: true,
      maxlength: [25, "Name cannot exceed 25 characters"],
    },
    Images: [{ type: mongoose.Schema.Types.ObjectId, ref: "Image" }],
    Location: String,
    Description: {
      type: String,
      default: function () {
        return `Memories from ${new Date().toISOString().split("T")[0]}`;
      },
      maxlength: [35, "Description cannot exceed 35 characters"],
    },
    Date: {
      type: Date,
      default: Date.now,
    },
    People: [{ type: mongoose.Schema.Types.ObjectId, ref: "Label" }],
    blurredImage: {
      type: String,
      required: true,
    },
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

  this.Images = uniqueImages.map((id) => new mongoose.Types.ObjectId(id));

  if (duplicateImagesCount > 0) {
    this._duplicateImages = duplicateImages;
  }

  next();
});

const Album = mongoose.model("Album", AlbumSchema);

export default Album;
