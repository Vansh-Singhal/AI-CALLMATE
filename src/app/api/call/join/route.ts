import { getServerSession } from "next-auth";
import { authOptions } from "../../../../../auth";
import connectToDB from "@/lib/dbConnect";
import CallDB from "@/model/Call";
import mongoose from "mongoose";

export async function POST(request: Request) {
  await connectToDB();

  const session = await getServerSession(authOptions);
  if (!session || !session.user?._id) {
    return Response.json(
      { success: false, message: "Unauthorized Session" },
      { status: 401 }
    );
  }

  const { roomId } = await request.json();

  if (!roomId) {
    return Response.json(
      { success: false, message: "roomId is required" },
      { status: 400 }
    );
  }

  try {
    const call = await CallDB.findOne({ roomId });

    if (!call) {
      return Response.json(
        { success: false, message: "Call not found" },
        { status: 404 }
      );
    }

    const userId = new mongoose.Types.ObjectId(session.user._id);

    // Add user to participants if not already present
    if (!call.participants.includes(userId)) {
      call.participants.push(userId);
      await call.save();
    }

    return Response.json(
      {
        success: true,
        message: "Joined call",
        roomId: call.roomId,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error joining call:", error);
    return Response.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
