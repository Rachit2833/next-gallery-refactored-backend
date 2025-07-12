const express = require("express");
const http = require("http");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const app = require("./app");
const { server } = require("./lib/socket");
const { connectDb } = require("./lib/connectDb");

dotenv.config({ path: "./config.env" });

const PORT = process.env.PORT || 3000; // Default to port 3000 if not defined



// Middleware to parse JSON
app.use(express.json());

// Connect to MongoDB
async function startServer() {
  try {
    await  connectDb()
  } catch (error) {
    console.error("DB Connection Error:", error);
    process.exit(1); // Exit the process if the database connection fails
  }
}
module.exports={connectDb}




server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


// Start the database connection
startServer();
