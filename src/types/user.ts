import { z } from "zod";

// Define schema for user data
export const userSchema = z.object({
  id: z.string(),
  email: z.string(),
  role: z.enum(["Admin", "User", "Moderator"]),
  oauth_id: z.string().nullable(), // Add oauth_id
  oauth_provider: z.string().nullable(), // Add oauth_provider
});

export type User = z.infer<typeof userSchema>;
