const { promisify } = require("util");
const User = require("../Schema/userSchema");
const jwt = require('jsonwebtoken')
async function useLoginTemporary(req, res) {
  const { userId } = req.body;

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


    res.send("userId cookie has been set!");
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).send("error");
  }
}






async function createNewUser(req, res) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please provide name, email, and password" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create new user
    const newUser = await User.create({ name, email, password });

    // Hide password in response
    newUser.password = undefined;

    // Generate JWT token
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES || "7d",
    });

    // Cookie expiration (28 days)
    const cookieExpires = new Date(Date.now() + 28 * 24 * 60 * 60 * 1000);

    // Cookie options
    const cookieOptions = {
      expires: cookieExpires,
      httpOnly: true, 
      secure: process.env.NODE_ENV === "production", // HTTPS only in prod
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      path: "/",
    };

    // Set cookie
    res.cookie("session", token, cookieOptions);

    // Send response without exposing token
    res.status(201).json({
      message: "User created successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error("User creation error:", error);
    res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
}







async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        message: "Please Provide Email and Password",
      });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).json({
        message: "Invalid Email or Password",
      });
    }

    // comparePassword should be await if it's async
    const isMatch = await user.comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid Email or Password",
      });
    }

    // Generate JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES || "7d",
    });

    // Cookie expiration (28 days for example)
    const cookieExpires = new Date(
      Date.now() + 28 * 24 * 60 * 60 * 1000
    );

    // Set cookie options
    const cookieOptions = {
      expires: cookieExpires,
      httpOnly: true, // Prevent JS access
      secure: process.env.NODE_ENV === "production", // HTTPS only in prod
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    };

    // Send cookie
    res.cookie("session", token, cookieOptions);

    // Send response without exposing token
    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      message: "Something Went Wrong",
      error: error.message,
    });
  }
}



async function protect(req, res, next) {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No session found! Please Log in first" });
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
      return res.status(404).json({ message: "No valid User Found" });
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

async function verifyUser(req, res) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);

    if (!user) {
      // User not found in DB
      return res.status(404).json({ message: "User not found" });
    }

    // User found
    return res.status(200).json({ valid: true, user });
  } catch (error) {
    console.error("Verification error:", error);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}




module.exports = { useLoginTemporary, createNewUser, login, protect, verifyUser }
