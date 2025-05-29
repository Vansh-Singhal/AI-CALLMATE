import { z } from "zod";

export const sendMessageSchema = z.object({
  callId: z.string(),
  senderId: z.string(), // optional if using auth token
  content: z.string().min(1),
  role: z.enum(["user", "assistant"]),
});
