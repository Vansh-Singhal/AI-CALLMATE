"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function Dashboard() {
  const router = useRouter();
  const [topic, setTopic] = useState("");
  const [roomToJoin, setRoomToJoin] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreateMeeting = async () => {
    if (!topic.trim()) return;
    setLoading(true);

    try {
      // Step 1: Create a call
      const callRes = await axios.post("/api/call/create", { topic });
      const roomId = callRes.data.roomId;
      // Step 2: Get token for that room
      const tokenRes = await axios.post("/api/token", { roomName: roomId.trim() });
      const token = tokenRes.data.token;
      console.log(token);

      router.push(`/call/${roomId.trim()}/${token}`);
    } catch (err) {
      console.error("Error creating meeting:", err);
      alert("Failed to create meeting");
    } finally {
      setLoading(false);
    }
  };

  const handleJoinMeeting = async () => {
    if (!roomToJoin.trim()) return;
    setLoading(true);

    try {
      const tokenRes = await axios.post("/api/token", {
        roomName: roomToJoin.trim(),
      });
      const token = tokenRes.data.token;

      router.push(`/call/${roomToJoin.trim()}/${token}`);
    } catch (err) {
      console.error("Error joining meeting:", err);
      alert("Failed to join meeting");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-10 p-4 bg-gray-100">
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Create a New Meeting</h2>
        <input
          type="text"
          placeholder="Enter meeting topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="w-full p-2 border rounded mb-3"
        />
        <button
          onClick={handleCreateMeeting}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Meeting"}
        </button>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Join an Existing Meeting</h2>
        <input
          type="text"
          placeholder="Enter room ID"
          value={roomToJoin}
          onChange={(e) => setRoomToJoin(e.target.value)}
          className="w-full p-2 border rounded mb-3"
        />
        <button
          onClick={handleJoinMeeting}
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
          disabled={loading}
        >
          {loading ? "Joining..." : "Join Meeting"}
        </button>
      </div>
    </div>
  );
}
