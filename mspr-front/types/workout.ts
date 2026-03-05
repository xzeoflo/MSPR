import { z } from "zod";
import { exerciseSchema } from "./exercise"; // Importe le schéma de l'exercice

export const workoutSchema = z.object({
  id: z.number().optional(),
  title: z.string().min(1, "Le titre est requis"),
  description: z.string().min(1, "La description est requise"),
  totalDurationInSeconds: z.number().optional(),
  difficulty: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]),
  workoutType: z.string().min(1, "Le type de workout est requis"), // Java: workoutType
  exercises: z.array(exerciseSchema).default([]),
  exerciseType: z.string().optional(), // Peut être null selon ton entité
  partnerBrand: z.string().optional().nullable(),
  createdAt: z.string().optional(),
});

export type Workout = z.infer<typeof workoutSchema>;

/**
 * Interface pour les statistiques d'âge (utilisé dans /stats/age)
 */
export interface WorkoutAgeStats {
  minAge: number;
  maxAge: number;
  count: number;
}

/**
 * Interface pour le DTO d'export/import (utilisé dans /export et /import)
 */
// export interface WorkoutDTO extends Workout {
//   // Ajoute ici des champs spécifiques au DTO si nécessaire
//   // comme des métadonnées d'exportation
// }
