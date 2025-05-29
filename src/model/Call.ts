import mongoose, { Schema, Document, model, models } from "mongoose";

export interface Call extends Document {
  roomId: string;
  participants: mongoose.Types.ObjectId[];
  startedAt: Date;
  endedAt?: Date;
  summary?: string;
  transcript?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CallSchema: Schema<Call> = new Schema(
  {
    roomId: {
      type: String,
      required: true,
      unique: true,
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
    summary: {
      type: String,
    },
    transcript: {
      type: String,
    },
  },
  { timestamps: true }
);

const CallDB = models.Call as mongoose.Model<Call> || model<Call>("Call", CallSchema);
export default CallDB;
