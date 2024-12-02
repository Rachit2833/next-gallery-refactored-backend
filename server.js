const express = require("express");
const app =require("./app")
const dotenv = require("dotenv");
const mongoose = require("mongoose");
dotenv.config({ path: "./config.env" });
const PORT = process.env.PORT;
const DB = process.env.DATA_BASE;
app.use(express.json());
async function startServer() {
  try {
    await mongoose.connect(DB);
    console.log("DB Connection Success");
  } catch (error) {
    console.error("DB Connection Error:", error);
    process.exit(1); // Exit the process with failure
  }
}
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
startServer()
