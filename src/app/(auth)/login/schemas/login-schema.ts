import { z } from "zod";

export const loginSchema = z.object({
  login: z.string({
    error: "O login deve ser uma string.",
  }),
  password: z
    .string({
      error: "A senha deve ser uma string.",
    })
    .min(6, {
      message: "A senha deve ter pelo menos 6 caracteres.",
    })
    .max(100, {
      message: "A senha deve ter no máximo 100 caracteres.",
    }),
});

export type LoginSchema = z.infer<typeof loginSchema>;
