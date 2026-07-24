import z from "zod";

export const systemsFormSchema = z.object({
  codigo: z.preprocess(
    (value) => (value === "" || value === null ? undefined : value),
    z.coerce.number().optional(),
  ),
  name: z.string().min(2, "Nome deve conter no mínimo 2 caracteres."),
  description: z.string().optional(),
  url: z.string().optional(),
  image: z.string().optional(),
});

export type ISystemsSchema = z.infer<typeof systemsFormSchema>;
