import { getServerSession } from "next-auth";
import { authOptions } from "../../../../../auth";
import connectToDB from "@/lib/dbConnect";
import CallDB from "@/model/Call";
import { z } from "zod";
import { endCallSchema } from "@/schema/endCallSchema";

export async function POST(request: Request) {
  await connectToDB();

  const session = await getServerSession(authOptions);
  if (!session || !session.user?._id) {
    return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  //body = { roomId: string, endedAt: date }
  const body = await request.json();
  const result = endCallSchema.safeParse(body);
  if (!result.success) {
    return Response.json({ success: false, message: "Invalid input" }, { status: 400 });
  }

  const { roomId, endedAt } = result.data;

  try {
    const call = await CallDB.findOne({roomId});
    if (!call) {
      return Response.json({ success: false, message: "Call not found" }, { status: 404 });
    }

    if (call.endedAt) {
      return Response.json({ success: false, message: "Call already ended" }, { status: 400 });
    }

    call.endedAt = endedAt;
    await call.save();

    return Response.json({ success: true, message: "Call ended" }, { status: 200 });
  } catch (err) {
    console.error("End call error:", err);
    return Response.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
