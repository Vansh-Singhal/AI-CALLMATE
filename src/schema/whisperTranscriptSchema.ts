import { z } from 'zod';

export const whisperTranscriptSchema = z.object({
  audioUrl: z.string().url(), // or File if client-side
});
