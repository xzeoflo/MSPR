import { z } from "zod";
import { exerciseSchema } from "./exercise";

export const workoutSchema = z.object({
  id: z.number().optional(),

  title: z.string().min(1, "Le titre est requis"),

  description: z.string().optional().nullable(),

  difficulty: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]),

  workoutType: z.enum(["CARDIO", "STRENGTH", "STRONGMAN", "STRETCHING", "POWERLIFTING", "PLYOMETRICS", "OLYMPIC_WEIGHTLIFTING"]),

  totalDurationInSeconds: z.number().nonnegative().default(0),
  totalCaloriesBurned: z.number().nonnegative().default(0),

  exercises: z.array(exerciseSchema).min(1, "Le workout doit contenir au moins 1 exercice"),

  exerciseType: z.string().optional(),
  partnerBrand: z.string().optional().nullable(),
  createdAt: z.string().optional(),
});

export type Workout = z.infer<typeof workoutSchema>;
