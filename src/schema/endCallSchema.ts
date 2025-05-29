import { z } from "zod";

export const endCallSchema = z.object({
  roomId: z.string(),
  endedAt: z.date(),
});
