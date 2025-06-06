"use client";

import { useParams } from "next/navigation";
import {
  LiveKitRoom,
  VideoConference,
} from "@livekit/components-react";
import "@livekit/components-styles";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function CallRoomPage() {
  const params = useParams();
  const roomIdParam = params.roomId;
  const roomId =
    typeof roomIdParam === "string" ? roomIdParam.replace("%20", " ") : (roomIdParam?.[0] ?? "");

  const token = params.token as string;
  const session = useSession();
  const router = useRouter();

  if (!session.data?.user || !roomId) {
    router.push("/");
  }

  if (!token) {
    return (
      <div className="h-screen flex items-center justify-center text-lg font-semibold">
        Connecting to your meeting...
      </div>
    );
  }

  return (
    <main className="min-h-screen">
      <LiveKitRoom
        token={token}
        serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
        connect
        video
        audio
      >
        <VideoConference />
      </LiveKitRoom>
      <h2 className="">{roomId}</h2>
    </main>
  );
}
