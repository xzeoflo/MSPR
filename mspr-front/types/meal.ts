import { z } from "zod";

export const mealSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, "Meal name is required"),

  mealType: z.string().min(1, "Meal type is required"),

  quantityG: z.coerce.number().min(0).default(0),
  caloriesKcal: z.coerce.number().min(0).default(0),
  proteinG: z.coerce.number().min(0).default(0),
  carbsG: z.coerce.number().min(0).default(0),
  fatsG: z.coerce.number().min(0).default(0),
  fiberG: z.coerce.number().min(0).default(0),
  sugarG: z.coerce.number().min(0).default(0),

  // Optionnels selon CSV
  sodiumMg: z.coerce.number().min(0).optional().default(0),
  cholesterolMg: z.coerce.number().min(0).optional().default(0),
  allergies: z.string().optional().nullable(),
  partnerBrand: z.string().optional().nullable(),
});

export type Meal = z.infer<typeof mealSchema>;
