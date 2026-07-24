import z from "zod";

const modulesWithPermissions = z.object({
  moduleId: z.string().optional(),
  permissions: z.array(z.string()).optional(),
});

const userPermissionsSchema = z.object({
  grupo: z.string().optional(),
  permissoes: z.array(z.string()).optional(),
});

const profileSchema = z.object({
  sistema: z.string().optional(),
  pagina_inicial: z.string().optional(),
  tempo_expiracao_token: z.string().optional(),
  permissoes_grupos: z.array(userPermissionsSchema).optional(),
});

export const usersFormSchema = z.object({
  username: z.string().optional(),
  nome: z.string().optional(),
  apelido: z.string().optional(),
  email: z.string().optional(),
  password: z.string().optional(),
  loja: z.any().optional(),
  role: z.string().optional(),
  profiles: z.array(profileSchema).optional(),
  modules: z.array(modulesWithPermissions).optional(),
  avatar_url: z.string().optional(),
  setor: z.string().optional(),
  pagina_inicial: z.string().optional(),
  status: z.enum(["ATIVO", "INATIVO", "BLOQUEADO"]).optional(),
  tempo_expiracao_token: z.string().optional(),
  lojas_associadas: z.array(z.string()).optional(),
});

export type IUsersSchema = z.infer<typeof usersFormSchema>;
