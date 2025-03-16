const { promisify } = require("util");
const User = require("../Schema/userSchema");
const jwt = require('jsonwebtoken')
async function useLoginTemporary(req, res) {
  const { userId } = req.body;
  console.log("Working", userId);

  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }

    res.cookie("userId", userId, {
      httpOnly: true,
      secure: false, // Use `true` in production (requires HTTPS)
      sameSite: "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    console.log("Set-Cookie Header:", res.getHeaders()["set-cookie"]); // Debugging

    res.send("userId cookie has been set!");
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).send("error");
  }
}




async function createNewUser(req, res) {
  try {
    const data = req.body;
    const newUser = await User.create(data);
    newUser.password = undefined; // Hide password in response

    // Create a JWT token with expiration
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES || "7d", // 7 days expiration
    });

    // Cookie expiration (convert days to milliseconds)
    const cookieExpires = new Date(Date.now() + 28 * 24 * 60 * 60 * 1000);

    // Set cookie options
    const cookieOptions = {
      expires: cookieExpires,
      httpOnly: true, // Prevents access from JavaScript
      secure: process.env.NODE_ENV === "production", // Only use HTTPS in production
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax", // Allow cross-site cookies in production
    };

    // Set cookie in the response
    res.cookie("jwt", token, cookieOptions);

    res.status(201).json({
      message: "User Created Successfully",
      token,
      user: newUser,
    });
  } catch (error) {
    console.error("User creation error:", error);
    res.status(500).json({
      message: "Something Went Wrong",
      error: error.message,
    });
  }
}





async function login(req,res){
  try {
      const {email,password}= req.body
      console.log(email,password,"sdfds");
      if(!email || !password){
        return res.status(400).json({
          message:"Please Provide Email and Password"
        })
      }
     const user= await User.findOne({email}).select("+password")
     console.log(user,"user");
     const compare = user.comparePassword(user.password,password)
     if(!compare){
       return res.status(400).json({
         message:"Invalid Email or Password"
       })
     }
      const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRES
      })
      res.status(200).json({
        token,
      });
  } catch (error) {
    console.error(error);
     res.status(500).json({
       message: "Something Went Wrong",
       error,
     });
  }
}



async function protect(req, res, next) {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Please Provide Token" });
    }
    const token = header.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Invalid Token Format" });
    }

    // Verify token using promisify
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // Find user from the decoded token
    const freshUser = await User.findById(decoded.id);
    if (!freshUser) {
      return res.status(404).json({ message: "User Not Found" });
    }
    req.user = freshUser;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or Expired Token",
      error: error.message,
    });
  }
}
async function verifyUser(req,res) {

   const token = req.headers.authorization.split(" ")[1]; // Get token from cookies
  console.log(token);
   if (!token) {
     return res.status(401).json({ message: "No token provided" });
   }

   try {
     const decoded = jwt.verify(token, process.env.JWT_SECRET);
     return res.status(200).json({ valid: true, user: decoded });
   } catch (error) {
     return res.status(401).json({ message: "Invalid or expired token" });
   }
  
}




module.exports={useLoginTemporary,createNewUser,login,protect,verifyUser}
