const User = require("../Schema/userSchema");
const Relation = require("../Schema/relationSchema");
const mongoose = require("mongoose");
const Group = require("../Schema/groupSchema");

async function getSearchUser(req, res) {
  try {
    const query = req.query.query || "";
    const userId = req.query._id; // Extract userId from query params

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const objectId = new mongoose.Types.ObjectId(userId);

    const data = await Relation.aggregate([
      {
        $match: {
          status: "accepted",
          $or: [{ userId: objectId }, { friendId: objectId }],
        },
      },
      {
        $lookup: {
          from: "Users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $lookup: {
          from: "Users",
          localField: "friendId",
          foreignField: "_id",
          as: "friend",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $unwind: "$friend",
      },
      {
        $match: {
          $or: [
            {
              userId: objectId,
              "friend.name": { $regex: query, $options: "i" },
            },
            {
              friendId: objectId,
              "user.name": { $regex: query, $options: "i" },
            },
          ],
        },
      },
      
    ]);
    const groupData = await Group.aggregate([
      {
        $match: {
          people: {
            $in: [new mongoose.Types.ObjectId(userId)],
          },
        },
      },
      {
        $match: {
          name: { $regex: query, $options: "i" }, // Case-insensitive regex search on 'name'
        },
      },
    ]);


    res.status(200).json({data,
      groupData
    });
  } catch (error) {
    console.error("Error in getSearchUser:", error);
    res.status(500).json({ error: "Server Error" });
  }
}

module.exports = { getSearchUser };
