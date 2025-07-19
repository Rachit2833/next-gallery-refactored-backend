import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: "./config.env" });

export const connectDb = async () => {
  await mongoose.connect(process.env.DATA_BASE);
  console.log("DB Connection Success");
};
