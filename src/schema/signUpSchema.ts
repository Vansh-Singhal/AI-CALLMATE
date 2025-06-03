import { z } from "zod";

export const signUpSchema = z.object({
  email: z.string().email({
    message: "Invalid Email Address",
  }),
  password: z
    .string()
    .min(3, { message: "Password must be atleast 3 characters" }),
  name: z.string(),
});
