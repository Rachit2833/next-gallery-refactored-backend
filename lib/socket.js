const { Server } = require("socket.io");
const http = require("http");
const express = require("express");
const app = express()

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000"], // Replace with your frontend URL
  },
});

const socketMap = {};

function getReceiverSocketId(userId) {
  return socketMap[userId];
}

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  if(userId) {
    socketMap[userId] = socket.id;
    io.emit("onlineUsers", socketMap);
  }
 



  socket.on("message", (message) => {
    io.to("nADWUIfbu2DXrtGLAAAG").emit("newIoMessage", message); // Change this room ID as needed
  });
  socket.on("joinGroups", (groupIds) => {
    if (!Array.isArray(groupIds)) {
      console.error("joinGroups received invalid data:", groupIds);
      return;
    }

    groupIds.forEach((groupId) => {
      socket.join(groupId);
      console.log(`Joined the group: ${groupId}`);
    });
  });
  socket.on("sendGroupMessage", ({ groupId, senderId, message }) => {
    console.log(`Message in group ${groupId} from ${senderId}: ${message}`);
    
    io.to(groupId).emit("receiveMessage", {
      groupId,
      senderId,
      message,
      timestamp: new Date(),
    });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected: " + socket.id);
    if (socketMap[userId] === socket.id) {
      console.log("deleting");
      delete socketMap[userId];
    }
    io.emit("onlineUsers", socketMap); // Emit updated list of online users after disconnection
  });
});

module.exports = { io, server, getReceiverSocketId,app };
