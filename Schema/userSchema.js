const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: {
       type: String,
       required: [true,"Please Provide Your Email"],
       unique: [true],
       lowercase: true,
       validate: [validator.isEmail,"Please Provide a Valid Email"]
     },
    profilePicture: { type: String, default: null },
    password: { 
      type: String, 
      required: true,
      select:false,

     },
  },
  { collection: "Users" } 
);
userSchema.pre("save",async function(next){
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password,12);
    }
    next();
})
userSchema.methods.comparePassword = async function(candidatePassword,userPassword){
    return await bcrypt.compare(candidatePassword,userPassword);
}
const User = mongoose.model("User", userSchema,"Users");

module.exports = User;
