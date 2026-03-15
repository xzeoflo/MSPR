import { z } from "zod";

export const mealSchema = z.object({
  id: z.number().optional(),
  mealType: z.string().min(1, "Meal type is required"),
  quantityG: z.coerce.number().min(0).default(0),
  allergies: z.string().optional().nullable(),
  caloriesKcal: z.coerce.number().min(0).default(0),
  proteinG: z.coerce.number().min(0).default(0),
  carbsG: z.coerce.number().min(0).default(0),
  fiberG: z.coerce.number().min(0).default(0),
  fatsG: z.coerce.number().min(0).default(0),
  sugarG: z.coerce.number().min(0).default(0),
  sodiumMg: z.coerce.number().min(0).default(0),
  cholesterolMg: z.coerce.number().min(0).default(0),
  partnerBrand: z.string().optional().nullable(),
});

export type Meal = z.infer<typeof mealSchema>;
