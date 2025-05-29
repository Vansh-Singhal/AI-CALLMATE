import mongoose, { Schema, Document, models, model } from "mongoose";

export interface User extends Document {
  email: string;
  name: string;
  password: string;
  createdAt: Date;
  verifyCode : string;
  verifyCodeExpiry: Date;
  isVerified: boolean;
}

const UserSchema: Schema<User> = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now(),
  },
  verifyCode : {
    type : String,
    required : true,
  },
  verifyCodeExpiry : {
    type: Date,
    required: true,
  },
  isVerified : {
    type: Boolean,
    required: true,
    default: false,
  },
});

const UserDB = models.User as mongoose.Model<User> || model<User>("User", UserSchema);
export default UserDB;