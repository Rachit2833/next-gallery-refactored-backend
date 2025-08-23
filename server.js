const express = require("express");
const dotenv = require("dotenv");
const labelRouter= require("./routes/labelRoutes")
const imageRouter= require("./routes/imageRoutes")
const albumRouter= require("./routes/albumRoutes")
const statsRouter= require('./routes/statsRouter')
const userRouter = require('./routes/usersRoutes')
// const friendRouter = require('./routes/friendRouter')
const cors = require("cors");
const cookieParser = require("cookie-parser");
const http =require("http")
const { connectDb } = require("./lib/connectDb");
const { protect } = require("./controller/authController");
const app = express()
dotenv.config({ path: "./config.env" });

const PORT = process.env.PORT || 3000; // Default to port 3000 if not defined
const server = http.createServer(app);


// Middleware to parse JSON

app.use(cookieParser());
app.use(
  cors({
    origin: [
      "http://localhost:3000", 
      "https://next-gallery-by-rachit2833.vercel.app"
    ],
    credentials: true,
  })
);


app.use(express.json({ limit: "10mb" })); 
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.get("/", (req, res) => {
  res.status(200).json({ message: "HELLO WORLD TEST" });
});


app.use("/user",userRouter );
app.use(protect)
app.use("/", labelRouter);
app.use("/image", imageRouter);
app.use("/album", albumRouter);
app.use("/stats", statsRouter);
app.all("*",(req,res)=>{
   res.status(404).json({
      message:`Cannot Find the ${req.originalUrl} `
   })
})

// app.use("/friends",friendRouter);





async function startServer() {
  try {
    await  connectDb()
  } catch (error) {
    console.error("DB Connection Error:", error);
    process.exit(1); // Exit the process if the database connection fails
  }
}

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

startServer();

module.exports=app
