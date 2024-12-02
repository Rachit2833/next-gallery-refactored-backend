const mongoose = require("mongoose");

// Define the ImageLabel schema
const ImageLabelSchema = new mongoose.Schema(
  {
    ImageUrl: String,
    Country: String,
    Favourite: Boolean,
    Location: {
      name: {
        type: String,
        required: true,
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
        validate: {
          validator: function (arr) {
            return arr.length === 2; // Ensures there are exactly two numbers
          },
          message:
            "Coordinates must contain exactly two numbers: [longitude, latitude]",
        },
      },
    },
    Description: {
      type: String,
      maxlength: [15, "Description cannot exceed 15 characters"],
      required: true,
    },
    Date: {
      type: Date,
      default: Date.now, // Automatically set the date to the current date and time
    },
    People: [{ type: mongoose.Schema.Types.ObjectId, ref: "Label" }], // Reference to Label collection
    
  },

  {
    collection: "Images", // Specify the collection name
  }
);

const Image = mongoose.model("Image", ImageLabelSchema);
module.exports = Image;
