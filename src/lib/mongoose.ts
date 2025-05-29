import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) throw new Error("MONGODB_URI is not defined in environment variables");

export async function connectToDB() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Database connected Successfully");
  } catch (error) {
    console.error("Database connection Failed, Error :", error);
  }
}
