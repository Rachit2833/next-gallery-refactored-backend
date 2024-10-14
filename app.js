const express = require("express");
const labelRouter= require("./routes/labelRoutes")
const app = express()
const cors = require("cors");
app.use(cors()); // Enable CORS
app.use(express.json({ limit: "10mb" })); // Adjust the limit as needed
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use("/", labelRouter);


module.exports = app;