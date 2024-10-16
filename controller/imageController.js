
const Image = require("../Schema/imageSchema");

async function addNewImage(req, res) {
  try {
    const newImage = new Image(req.body); // Use req.body instead of req.data
    const image = await newImage.save();
    console.log(image);
    res.status(200).json({
      message: "Image Saved",
      data: image, // Return the saved image data
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      message: "Something Went Wrong",
      error: error.message, // Include the error message for debugging
    });
  }
}

module.exports = {addNewImage};

