const express = require("express");
const http = require("http");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const app = require("./app");
const { server } = require("./lib/socket");

dotenv.config({ path: "./config.env" });

const PORT = process.env.PORT || 3000; // Default to port 3000 if not defined
const DB = process.env.DATA_BASE;

// Middleware to parse JSON
app.use(express.json());

// Connect to MongoDB
async function startServer() {
  try {
    await mongoose.connect(DB);
    console.log("DB Connection Success");
  } catch (error) {
    console.error("DB Connection Error:", error);
    process.exit(1); // Exit the process if the database connection fails
  }
}




server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


// Start the database connection
startServer();
