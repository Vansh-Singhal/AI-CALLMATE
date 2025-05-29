import mongoose from "mongoose";

type ConnectionObject = {
  isConnected?: number;
};

const connection: ConnectionObject = {};

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI)
  throw new Error("MONGODB_URI is not defined in environment variables");

async function connectToDB(): Promise<void> {
  if (connection.isConnected) {
    console.log("Already Connected to Database");
    return;
  }
  try {
    const db = await mongoose.connect(MONGODB_URI || "", {});
    connection.isConnected = db.connections[0].readyState;
    console.log("Database connected Successfully");
  } catch (error) {
    console.error("Database connection Failed, Error :", error);
    process.exit(1);
  }
}

export default connectToDB;
