import { createLocalTracks, Room } from "livekit-client";

const joinRoom = async (roomId: string) => {
  // Fetch token from backend
  const res = await fetch("/api/token", {
    method: "POST",
    body: JSON.stringify({ roomName: "call-123" }),
  });
  const { token } = await res.json();

  // Connect to the room
  const room = new Room();

  await room.connect(process.env.NEXT_PUBLIC_LIVEKIT_URL!, token);

  // Publish camera & mic tracks
  const tracks = await createLocalTracks({
    audio: true,
    video: true,
  });

  for (const track of tracks) {
    await room.localParticipant.publishTrack(track);
  }

  console.log("Connected to room:", room.name);
};
