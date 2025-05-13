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
async function verifyAutoSend(req, res) {
  try {
    const { id } = req.query;
    if (!id) {
      return res
        .status(400)
        .json({ message: "Invalid or missing user ID or friend IDs" });
    }

    const _id = new mongoose.Types.ObjectId(id);


    // Find relationships where autoSend is enabled for any friendId
    const data = await Relation.find({
      $or: [
        {
          userId: _id,
          "autoSend.userId.enabled": true,
        },
        {
          friendId: _id,
          "autoSend.friendId.enabled": true,
        },
      ],
      status: "accepted",
    });

    if (data.length === 0) {
      return res
        .status(404)
        .json({ message: "No friends found with auto-send enabled" });
    }

    res.status(200).json({ data });
  } catch (error) {
    console.error("Error in verifyAutoSend:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
}
async function updateAutoSend(req, res) {
  try {
    console.log(req.query.relationId);

    if (!req.query.relationId) {
      return res.status(400).json({ message: "Relation ID is required" });
    }
    const idBit = req.query.idBit;

    const query = {}; 
    if (req.body.enabled) {
      const enabledX = req.body.enabled === 1?false:true;
      if(idBit===1){
        query["autoSend.userId.enabled"] = enabledX;
      }else{
        query["autoSend.friendId.enabled"] = enabledX;
      }
     
    }

    if (req.body.descriptorID) {
      if(idBit===1){
        query["autoSend.userId.descriptorId"] = new mongoose.Types.ObjectId(req.body.descriptorID);
      }
      else{
        query["autoSend.friendId.descriptorId"] = new mongoose.Types.ObjectId(req.body.descriptorID);
      }
    }
    console.log(query);

    if (Object.keys(query).length === 0) {
      return res
        .status(400)
        .json({ message: "No valid fields provided for update" });
    }

    const data = await Relation.findByIdAndUpdate(
      req.query.relationId,
      { $set: query }, // Corrected update format
      { new: true } // Returns the updated document
    );

    if (!data) {
      console.log("2");
      return res.status(404).json({ message: "Relation not found" });
    }
    console.log(data,"1");
    res.status(200).json({ message: "Auto-send updated successfully", data });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error updating auto-send", error: error.message });
  }
}


module.exports = { getAllFriends, deleteFriend, verifyAutoSend,updateAutoSend };
