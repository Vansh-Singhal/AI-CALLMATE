import { z } from "zod";

export const createCallSchema = z.object({
  topic: z.string().optional(),
});
