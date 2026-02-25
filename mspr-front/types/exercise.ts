import { z } from "zod";

export const exerciseSchema = z.object({
  id: z.number(),
});

export type Exercise = z.infer<typeof exerciseSchema>;
