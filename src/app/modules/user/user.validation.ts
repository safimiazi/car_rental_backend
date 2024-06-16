import { string, z } from "zod";
import { Role } from "./user.constant";

const createUserValidationSchema = z.object({
  body: z.object({
    name: z.string(),
    email: z.string(),
    role: z.enum([...Role] as [string, ...string[]]),
    password: z.string().max(20),
    phone: z.string(),
    address: z.string(),
  }),
});

export const userValidations = {
  createUserValidationSchema,
};
