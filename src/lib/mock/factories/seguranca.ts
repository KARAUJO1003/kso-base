import { faker, fakeId, fakeTimestamps, pickOne, pickSome, sequentialCodigo } from "./helpers";
import type { ISystem, IModules } from "@/features/(seguranca)/users/interfaces/modules";
import type { IRoles } from "@/features/(seguranca)/users/interfaces/roles";
import type { IPermissions } from "@/features/(seguranca)/users/interfaces/permissions";
import type { IUsers } from "@/features/(seguranca)/users/interfaces/users";
import type { ILoja } from "@/types/lojas/types";
import type { ISetor } from "@/types/setores/type";

export function createSistema(index: number): ISystem {
  const name = faker.helpers.arrayElement(["Kso ERP", "Kso PDV", "Kso Portal"]);
  return {
    _id: fakeId(),
    codigo: index + 1,
    name: `${name}`,
    description: `Sistema ${name}`,
    ...fakeTimestamps(),
  };
}

export function createPermissao(index: number): IPermissions {
  const acao = faker.helpers.arrayElement(["criar", "editar", "excluir", "ver"]);
  const recurso = faker.helpers.arrayElement([
    "lojas", "itens", "colaboradores", "fornecedores", "usuarios", "relatorios",
  ]);
  return {
    _id: fakeId(),
    name: `${recurso}:${acao}`,
    description: `Permite ${acao} em ${recurso}`,
    ...fakeTimestamps(),
  };
}

export function createModuloPermissao(
  index: number,
  ctx: { sistemas: ISystem[]; permissoes: IPermissions[] },
): IModules {
  const name = faker.helpers.arrayElement([
    "Cadastros", "Financeiro", "Estoque", "Relatórios", "Administração",
  ]);
  return {
    _id: fakeId(),
    name: `${name} ${index + 1}`,
    slug: `${name.toLowerCase()}-${index + 1}`,
    sistema: pickOne(ctx.sistemas),
    permissoes: pickSome(ctx.permissoes, 3, 8),
    ...fakeTimestamps(),
  };
}

export function createRole(index: number, permissaoGrupos: IModules[]): IRoles {
  const name = faker.helpers.arrayElement([
    "Administrador", "Gerente de Loja", "Operador de Caixa", "Estoquista", "Financeiro",
  ]);
  return {
    _id: fakeId(),
    name: `${name}`,
    permissoes_grupos: pickSome(permissaoGrupos, 1, 3).map((grupo) => ({
      grupo,
      permissoes: grupo.permissoes ?? [],
    })),
    ...fakeTimestamps(),
  };
}

export function createUser(
  index: number,
  ctx: { lojas: ILoja[]; roles: IRoles[]; setores: ISetor[] },
): IUsers {
  const nome = faker.person.fullName();
  return {
    _id: fakeId(),
    username: faker.internet.username({ firstName: nome.split(" ")[0] }).toLowerCase(),
    email: faker.internet.email({ firstName: nome.split(" ")[0] }).toLowerCase(),
    nome,
    apelido: nome.split(" ")[0],
    loja: pickOne(ctx.lojas),
    role: pickOne(ctx.roles),
    setor: pickOne(ctx.setores)._id,
    avatar_url: faker.image.avatar(),
    status: faker.helpers.arrayElement(["ATIVO", "ATIVO", "ATIVO", "INATIVO", "BLOQUEADO"]),
    lojas_associadas: pickSome(ctx.lojas, 1, 3).map((loja) => loja._id),
  };
}
