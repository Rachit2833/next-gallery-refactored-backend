const Relation = require("../Schema/relationSchema");
const mongoose = require("mongoose");

async function getAllFriends(req, res) {
  try {
    const { id } = req.query;
   
    if (!id) {
      return res.status(400).json({ message: "Invalid or missing user ID" });
    }

    const objectId = new mongoose.Types.ObjectId(id);
 
    const data = await Relation.find({
      $or: [{ userId: objectId }, 
        { friendId: objectId }],
      status: "accepted",
    })
      .populate("userId")
      .populate("friendId");
    res.status(200).json({ data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
}




async function deleteFriend(req, res) {
  try {
    const { relationId } = req.body;
    if (!relationId) {
      res.status(400).json({ message: "Relation Id is required" });
    }
    const data = await Relation.findByIdAndDelete(relationId);
    res.status(200).json({
      message: "Friend removed successfully",
    });
  } catch (error) {
    res.status(400).json({ message: "Something went wrong" });
  }
}
module.exports = { getAllFriends, deleteFriend };
