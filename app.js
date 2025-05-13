const express = require("express");
const labelRouter= require("./routes/labelRoutes")
const imageRouter= require("./routes/imageRoutes")
const albumRouter= require("./routes/albumRoutes")
const statsRouter= require('./routes/statsRouter')
const userRouter = require('./routes/usersRoutes')
const messageRouter = require('./routes/messageRoutes')
const authRouter = require('./routes/authRouter')
const friendRouter = require('./routes/friendRouter')
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { app } = require("./lib/socket");
const { protect } = require("./controller/authController");
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);


app.use(express.json({ limit: "10mb" })); 
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use("/user",userRouter );

app.use("/", labelRouter);
app.use("/image", imageRouter);
app.use("/album", albumRouter);
app.use("/stats", statsRouter);
app.use("/message",messageRouter);
app.use("/login", authRouter);
app.use("/friends",friendRouter);



app.all("*",(req,res)=>{
   res.status(404).json({
      message:`Cannot Find the ${req.originalUrl} `
   })
})

module.exports = app;