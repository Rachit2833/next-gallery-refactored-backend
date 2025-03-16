const { getReceiverSocketId,io } = require("../lib/socket");
const Message = require("../Schema/messageSchema");
const GroupMessage = require("../Schema/groupMessageSchema");
const Group = require("../Schema/groupSchema");
const { default: mongoose } = require("mongoose");


// Importing here to avoid circular dependency
async function getAllMessages(req,res) {
  try {
     const data =await Message.find()
     res.status(200).json(data)
  } catch (error) {
     res.status(400).json("Something went wrong");
  }
}

async function sendMessage(req, res) {
  try {
    
    const newData = req.body;
    console.log(newData,"dbkhsabdjhsd");
    const receiverId = newData.receiverId;
    const senderId   = newData.senderId
    const receiverSocket = getReceiverSocketId(receiverId);
    if (receiverSocket) {
      io.to(receiverSocket).emit("newIoMessage", {
        senderId,
        content:newData.content
      });
    } else {
      console.log("Receiver is offline, message not sent via socket.");
    }
     const newLabel = new Message(newData);
     const data = await newLabel.save();
    res.status(200).json(data);
  } catch (error) {
    console.error("Error in sendMessage:", error);
    res.status(500).json({ error: error.message });
  }
}
async function addGroup(req,res) {
  try {
    const {_id}=req.query
    const data = req.body
    const newGroup = new Group({
      ...data,
      admin: [_id],
      createdBy: _id,
      groupImage: req.body.ImageUrl,
     });
    const doc= await newGroup.save()
    res.status(200).json({
      message:"Group Add Successfully"
    })
  } catch (error) {
    console.log(5);
    console.error(error);
    res.status(500).json({
      message:"Something Went Wrong"
    })
  }
}
async function deleteGroup(req, res) {
  try {
    const {_id} = req.query
    await Group.findByIdAndDelete(_id)
    res.status(200).json({
      message: "Group Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Something Went Wrong",
    });
  }
}
async function getAllGroups(req, res) {
  try {
    const { _id } = req.query;

    if (!_id) {
      return res.status(400).json({ message: "Id is required" });
    }

    const data = await Group.find({ people: _id }).populate("people"); // Find groups where _id is in people array

    return res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching groups:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

async function updateGroup(req, res) {
  try {
    const {  groupId } = req.query;
    const {removeUser,addUser,changeName,changeDescription}= req.body
    const data =  await Group.findById(groupId)
    console.log("sadnasj",addUser);
   if(!data){
    return res
        .status(400)
        .json({ message: "Group ID or User ID is missing" });
    }
    if (!groupId) {
      return res
        .status(400)
        .json({ message: "Group ID or User ID is missing" });
    }
    const updateFields={}
    if(changeName){
       updateFields.name=changeName
    }
    if(changeDescription){
      updateFields.description=changeDescription
    }
    if(addUser){
      updateFields.$addToSet={people:addUser}
    }
   if (removeUser && removeUser.length > 0) {
     // Ensure data.admin and data.people are arrays
     if (!Array.isArray(data.admin) || !Array.isArray(data.people)) {
       throw new Error(
         "Invalid data structure: admin and people must be arrays."
       );
     }

     // Users to be removed from admin
     const adminsToRemove = removeUser.filter((user) =>
       data.admin.includes(user)
     );

     // Remove users from admin
     if (adminsToRemove.length > 0) {
       updateFields.$pull = { admin: { $in: adminsToRemove } };
     }

     // If the last admin is being removed, promote the next available user
     const remainingAdmins = data.admin.filter(
       (user) => !adminsToRemove.includes(user)
     );

     if (remainingAdmins.length === 0 && data.people.length > 0) {
       const newAdmin = data.people.find((user) => !removeUser.includes(user)); // Pick next person
       if (newAdmin) {
         updateFields.$push = { admin: newAdmin };
       }
     }

     // Remove users from people
     updateFields.$pull = {
       ...updateFields.$pull,
       people: { $in: removeUser },
     };
   }


    const updatedGroup = await Group.findByIdAndUpdate(
      groupId,
      updateFields,
      {new:true}
    ).populate("people");

    if (!updatedGroup) {
      return res.status(404).json({ message: "Group not found" });
    }

    return res
      .status(200)
      .json({ updatedGroup  });
  } catch (error) {
    console.error("Error removing member:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}


async function sendGroupMessage(req, res) {
  try {
    const body = req.body;
    if (!body.senderId || !body.receiverId || !body.content) {
      return res.status(400).json({ mess: "Missing required fields" });
    }
    const newGroupMessage = new GroupMessage({
      senderId: new mongoose.Types.ObjectId(body.senderId),
      receiverId: new mongoose.Types.ObjectId(body.receiverId),
      content: body.content,
      messageType: body.messageType || "text",
      mediaUrl: body.mediaUrl || "",
    });
    await newGroupMessage.save();
    io.to(body.receiverId).emit("groupMessage", newGroupMessage);

    res.status(200).json({ newGroupMessage });
  } catch (error) {
    console.error("Error saving group message:", error);
    res.status(400).json({
      mess: "Something went wrong",
      error: error.message,
    });
  }
}



    async function getAllMessagesNew(req,res) {
       try {
           const {_id,selectedID} = req.query
           const data = await Message.find({
               senderId:    new mongoose.Types.ObjectId(_id),
               receiverId:  new mongoose.Types.ObjectId(selectedID) 
           });
           res.status(200).json({
            data
           })
       } catch (error) {
          res.status(404).json({
            message:"Something went wrong"
          })
       }
    }



module.exports = { sendMessage, getAllMessages,addGroup,deleteGroup,getAllGroups,updateGroup,sendGroupMessage,getAllMessagesNew}
