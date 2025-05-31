import { getServerSession } from "next-auth";
import { authOptions } from "../../../../../auth";
import CallDB from "@/model/Call";
import { RoomServiceClient } from "livekit-server-sdk";
import connectToDB from "@/lib/dbConnect";
import { createCallSchema } from "@/schema/createCallSchema";

// LiveKit client
const livekit = new RoomServiceClient(
  process.env.LIVEKIT_URL!,
  process.env.LIVEKIT_API_KEY!,
  process.env.LIVEKIT_API_SECRET!
);

export async function POST(request: Request) {
  await connectToDB();

  const session = await getServerSession(authOptions);
  if (!session || !session.user?._id) {
    return Response.json(
      {
        success: false,
        message: "Unauthorized. Session not found.",
      },
      { status: 401 }
    );
  }

  const body = await request.json();

  const result = createCallSchema.safeParse(body);
  if (!result.success) {
    return Response.json(
      {
        success: false,
        message: "Invalid input",
      },
      { status: 400 }
    );
  }

  const { topic } = result.data;
  const hostId = session.user._id;

  try {
    const room = await livekit.createRoom({
      name: `call-${Date.now()}`,
      emptyTimeout: 60 * 5,
      maxParticipants: 4,
    });

    const call = await CallDB.create({
      roomId: room.name,
      hostId,
      participants: [hostId],
      startedAt: new Date(),
      endedAt: null,
      topic,
      summary: "",
      transcript: "",
    });

    return Response.json(
      {
        success: true,
        message: "Call created",
        roomId: call.roomId,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("Call creation failed:", err);
    return Response.json(
      {
        success: false,
        message: "Internal server error while creating call",
      },
      { status: 500 }
    );
  }
}
