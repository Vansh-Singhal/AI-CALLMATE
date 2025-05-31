import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../auth";
import { AccessToken } from "livekit-server-sdk";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return Response.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  const { roomName } = await req.json();

  if (!roomName) {
    return Response.json(
      { success: false, message: "Missing roomName" },
      { status: 400 }
    );
  }

  try {
    const token = new AccessToken(
      process.env.LIVEKIT_API_KEY!,
      process.env.LIVEKIT_API_SECRET!,
      {
        identity: session.user._id,
        name: session.user.name,
      }
    );

    token.addGrant({ roomJoin: true, room: roomName });

    const jwt = await token.toJwt();

    return Response.json({
      success: true,
      token: jwt,
    });
  } catch (error) {
    console.error("Error creating token:", error);
    return Response.json(
      { success: false, message: "Token generation failed" },
      { status: 500 }
    );
  }
}
