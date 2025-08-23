const { promisify } = require("util");
const User = require("../Schema/userSchema");
const jwt = require('jsonwebtoken')


// Utility function for sending token in cookie
const sendToken = (user, statusCode, res) => {
  // Generate JWT
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES || "7d",
  });

  // Cookie expiration (28 days)
  const cookieExpires = new Date(Date.now() + 28 * 24 * 60 * 60 * 1000);

  // Cookie options
 const cookieOptions = {
  expires: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000),
  httpOnly: true,
  secure: true,            // HTTPS Only!
  sameSite: "None",        // Required for cross-site cookies
  path: "/",               // Should be root unless you have SPA routing issues
  // domain: ".yourdomain.com" // Optional, if your backend is in a subdomain
};

  // Set cookie
  res.cookie("session", token, cookieOptions);

  // Hide password from response
  user.password = undefined;

  res.status(statusCode).json({
    success: true,
    token, // optional, you can omit if you only want cookies
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  });
};

// ====================== CREATE USER ======================
export const createNewUser = async (req, res) => {
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

    // Create user
    const newUser = await User.create({ name, email, password });

    // Send token + cookie
    sendToken(newUser, 201, res);
  } catch (error) {
    console.error("User creation error:", error);
    res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};

// ====================== LOGIN ======================
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password" });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Compare password
    const isMatch = await user.comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Send token + cookie
    sendToken(user, 200, res);
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};




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




module.exports = { createNewUser, login, protect, verifyUser }

