import mongoose, { Schema, Document, model, models } from "mongoose";

export interface Call extends Document {
  roomId: string;
  hostId: mongoose.Types.ObjectId;
  participants: mongoose.Types.ObjectId[];
  startedAt: Date;
  endedAt?: Date;
  topic? : string;
  summary?: string;
  transcript?: string;
}

const CallSchema: Schema<Call> = new Schema(
  {
    roomId: {
      type: String,
      required: true,
      unique: true,
    },
    hostId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    startedAt: {
      type: Date,
      required: true,
    },
    endedAt: {
      type: Date,
    },
    topic: {
      type: String,
    },
    summary: {
      type: String,
    },
    transcript: {
      type: String,
    },
  }
);

const CallDB = models.Call as mongoose.Model<Call> || model<Call>("Call", CallSchema);
export default CallDB;
