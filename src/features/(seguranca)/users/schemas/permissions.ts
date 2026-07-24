import z from "zod";

export const permissionsFormSchema = z.object({
  name: z.string().min(2, {
    message: "Nome deve conter no mínimo 2 caracteres.",
  }),
  description: z.string().optional(),
});

export type IPermissionsSchema = z.infer<typeof permissionsFormSchema>;
