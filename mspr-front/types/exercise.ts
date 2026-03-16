// types/exercise.ts
import { z } from "zod";

export const exerciseSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, "Le nom est requis"),
  description: z.string().min(1, "La description est requise"),
  durationInSeconds: z.number().nonnegative(),
  repetitions: z.number().int().nonnegative(),
  sets: z.number().int().nonnegative(),
  caloriesBurned: z.number().nonnegative(),
  intensityLevel: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]),
  sequenceOrder: z.number().int().nullable(),
  workoutId: z.number().optional(),
  exerciseType: z.string().min(1, "Le type d'exercice est requis"),

  exerciseEquipments: z.array(z.string()).default([]),
});

export type Exercise = z.infer<typeof exerciseSchema>;
