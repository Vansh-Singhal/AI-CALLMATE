"use client";

import { useParams } from "next/navigation";
import { LiveKitRoom, VideoConference } from "@livekit/components-react";
import "@livekit/components-styles";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function CallRoomPage() {
  const params = useParams();
  const roomIdParam = params.roomId;
  const roomId =
    typeof roomIdParam === "string"
      ? roomIdParam.replace("%20", " ")
      : (roomIdParam?.[0] ?? "");

  const token = params.token as string;
  const session = useSession();
  const router = useRouter();

  if (!session.data?.user || !roomId) {
    router.push("/");
  }

  if (!token) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <div className="text-white text-lg font-semibold">
            Connecting to your meeting...
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-900 relative">
      {/* Room Title Overlay */}
      <div className="absolute top-4 left-4 z-10 bg-black/50 backdrop-blur-sm rounded-lg px-4 py-16">
        <h2 className="text-white font-semibold text-lg">
          ROOM ID : <span className="underline">{roomId}</span>
        </h2>
      </div>

      {/* Video Conference Container */}
      <div className="h-screen">
        <LiveKitRoom
          token={token}
          serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
          connect
          video
          audio
        >
          <VideoConference />
        </LiveKitRoom>
      </div>
    </main>
  );
}
