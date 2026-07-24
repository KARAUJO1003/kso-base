import z from "zod";

const rolePermissionsGroupSchema = z.object({
  grupo: z.string(),
  permissoes: z.array(z.string()),
});

export const rolesFormSchema = z.object({
  name: z.string().min(2, {
    message: "Nome deve conter no mínimo 2 caracteres.",
  }),
  permissoes_grupos: z.array(rolePermissionsGroupSchema).optional(),
});

export type IRolesSchema = z.infer<typeof rolesFormSchema>;
