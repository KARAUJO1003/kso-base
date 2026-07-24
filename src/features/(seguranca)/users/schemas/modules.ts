import z from "zod";

export const modulesFormSchema = z.object({
  name: z.string().min(2, {
    message: "Nome deve conter no mínimo 2 caracteres.",
  }),
  sistema: z.string().optional(),
  permissoes: z.array(z.string()).optional(),
});

export type IModulesSchema = z.infer<typeof modulesFormSchema>;
