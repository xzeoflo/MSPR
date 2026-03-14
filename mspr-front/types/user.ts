import { z } from "zod";

export const userSchema = z.object({
  id: z.number(),
  email: z.email("Format email invalide"),
  firstName: z.string().min(1, "Le prénom est requis"),
  lastName: z.string().optional().nullable(),
  birthday: z.string().optional().nullable(),
  partnerBrand: z.string().optional().nullable(),
  role: z.enum(["ADMIN", "COACH", "CLIENT"]),
  subscriptionTier: z.enum(["FREEMIUM", "PREMIUM", "PREMIUM_PLUS", "FREE"]).optional().nullable(),
});

export type User = z.infer<typeof userSchema>;
