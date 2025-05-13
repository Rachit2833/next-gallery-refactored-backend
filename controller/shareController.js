const { default: mongoose } = require("mongoose");
const Share = require("../Schema/sharedSchema");

async function autoShareEnabled(req, res) {
  try {
    const newSharedImage = new Share(req.body);
    const savedImage = await newSharedImage.save();
    res.status(200).json({ savedImage });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
}
async function getShareImages(req, res) {
  try {

    const id= new mongoose.Types.ObjectId(req.query.id);
    const sharedImage = await Share.find({
      sharedIds: { $in: [id] },
    }).populate("imgId");
    res.status(200).json({ sharedImage });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
}
async function deleteImageFromYou(req, res) {
  try {
    if (!req.query.id || !req.query.sharedId) {
      console.log(1);
      return res
        .status(400)
        .json({ message: "Invalid or missing user ID or friend IDs" });
    }

    console.log(2);
    const sharedId = req.query.sharedId;
    console.log(3);

    const data = await Share.findByIdAndUpdate(
      req.query.id,
      { $pull: { sharedIds: new mongoose.Types.ObjectId(req.query.sharedId) } },
      { new: true } // Correct placement of new: true
    );

    console.log(4, data);

    return res.status(200).json({ message: "Image deleted successfully" });
  } catch (error) {
    console.error(error); // Log the error for debugging
    return res.status(500).json({ message: "Something went wrong" });
  }
}

module.exports = { autoShareEnabled, getShareImages, deleteImageFromYou };
