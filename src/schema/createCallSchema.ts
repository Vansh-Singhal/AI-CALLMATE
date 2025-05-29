import { z } from "zod";

export const createCallSchema = z.object({
  roomId: z.string().min(1),
  participants: z.array(z.string()).nonempty(), // array of user IDs
  startedAt: z.date(),
});
