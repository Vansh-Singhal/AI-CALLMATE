import mongoose, { Schema, Document, model, models } from "mongoose";

export interface Message extends Document {
  callId: mongoose.Types.ObjectId;
  sender: mongoose.Types.ObjectId;
  content: string;
  role: "user" | "assistant";
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema: Schema<Message> = new Schema(
  {
    callId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Call",
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    content: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "assistant"],
      default: "user",
    },
  },
  { timestamps: true }
);

const MessageDB = models.Message as mongoose.Model<Message> || model<Message>("Message", MessageSchema);
export default MessageDB;
