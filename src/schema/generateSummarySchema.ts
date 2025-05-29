import { z } from "zod";

export const generateSummarySchema = z.object({
  callId: z.string(),
  transcript: z.string().min(1),
});
