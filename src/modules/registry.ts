import {
  IconArrowsExchange,
  IconBell,
  IconBox,
  IconBoxMultiple,
  IconBriefcase,
  IconBuildingStore,
  IconBuildingWarehouse,
  IconCategory,
  IconCoins,
  IconFolders,
  IconId,
  IconLock,
  IconReportMoney,
  IconRuler,
  IconSettings,
  IconSettings2,
  IconShieldLock,
  IconStackFront,
  IconTableOptions,
  IconTruck,
  IconUserFilled,
  IconUsers,
  IconUsersGroup,
} from "@tabler/icons-react";
import type { FlagKeyType } from "@/lib/feature-flags/feature-flag";
import type { PermissionInput } from "@/lib/auth/types/permissions";

/**
 * Fonte única de verdade por módulo: sidebar, feature flag e permissão saem
 * todos daqui. Para desligar um módulo por cliente/projeto sem tocar
 * código, liste a `key` em NEXT_PUBLIC_DISABLED_MODULES (.env), separado por
 * vírgula (ex: "cargos,motivos-trocas").
 */
export type ModuleCategory = "administrativo" | "organizacao" | "inventario";

export type ModuleDefinition = {
  key: string;
  label: string;
  route: string;
  icon: any;
  category: ModuleCategory;
  permissionBase: PermissionInput;
  featureFlag: FlagKeyType;
  defaultEnabled: boolean;
};

const MODULE_DEFINITIONS: ModuleDefinition[] = [
  // Administrativo
  {
    key: "users",
    label: "Controle de Usuários",
    route: "/users",
    icon: IconUsers,
    category: "administrativo",
    permissionBase: "users",
    featureFlag: "modules.administrativo.users.visualizar",
    defaultEnabled: true,
  },
  {
    key: "roles",
    label: "Papéis (Roles)",
    route: "/users/roles",
    icon: IconShieldLock,
    category: "administrativo",
    permissionBase: "roles",
    featureFlag: "modules.administrativo.roles.visualizar",
    defaultEnabled: true,
  },
  {
    key: "permissions",
    label: "Permissões",
    route: "/users/permissions",
    icon: IconLock,
    category: "administrativo",
    permissionBase: "permissions",
    featureFlag: "modules.administrativo.permissions.visualizar",
    defaultEnabled: true,
  },
  {
    key: "modules",
    label: "Módulos (Grupos de Permissão)",
    route: "/users/modules",
    icon: IconSettings2,
    category: "administrativo",
    permissionBase: "modules",
    featureFlag: "modules.administrativo.modules.visualizar",
    defaultEnabled: true,
  },
  {
    key: "systems",
    label: "Sistemas",
    route: "/users/systems",
    icon: IconSettings,
    category: "administrativo",
    permissionBase: "systems",
    featureFlag: "modules.administrativo.systems.visualizar",
    defaultEnabled: true,
  },
  {
    key: "parametros",
    label: "Parâmetros",
    route: "/parametros",
    icon: IconSettings,
    category: "administrativo",
    permissionBase: "parametros",
    featureFlag: "modules.administrativo.parametros.visualizar",
    defaultEnabled: true,
  },
  {
    key: "lembretes",
    label: "Lembretes",
    route: "/lembretes",
    icon: IconBell,
    category: "administrativo",
    permissionBase: "lembretes",
    featureFlag: "modules.administrativo.lembretes.visualizar",
    defaultEnabled: true,
  },

  // Organização
  {
    key: "lojas",
    label: "Lojas",
    route: "/lojas",
    icon: IconBuildingStore,
    category: "organizacao",
    permissionBase: "lojas",
    featureFlag: "modules.organizacao.lojas.visualizar",
    defaultEnabled: true,
  },
  {
    key: "grupos-lojas",
    label: "Grupo de Lojas",
    route: "/grupos-lojas",
    icon: IconStackFront,
    category: "organizacao",
    permissionBase: "grupos-lojas",
    featureFlag: "modules.organizacao.gruposLojas.visualizar",
    defaultEnabled: true,
  },
  {
    key: "setores",
    label: "Setores",
    route: "/setores",
    icon: IconCategory,
    category: "organizacao",
    permissionBase: "setores",
    featureFlag: "modules.organizacao.setores.visualizar",
    defaultEnabled: true,
  },
  {
    key: "gerencia",
    label: "Gerências",
    route: "/gerencia",
    icon: IconBriefcase,
    category: "organizacao",
    permissionBase: "gerencia",
    featureFlag: "modules.organizacao.gerencia.visualizar",
    defaultEnabled: true,
  },
  {
    key: "cargos",
    label: "Cargos",
    route: "/cargos",
    icon: IconId,
    category: "organizacao",
    permissionBase: "cargos",
    featureFlag: "modules.organizacao.cargos.visualizar",
    defaultEnabled: true,
  },
  {
    key: "colaboradores",
    label: "Colaboradores",
    route: "/colaboradores",
    icon: IconUsersGroup,
    category: "organizacao",
    permissionBase: "colaboradores",
    featureFlag: "modules.organizacao.colaboradores.visualizar",
    defaultEnabled: true,
  },
  {
    key: "pessoas",
    label: "Pessoas (Físicas / Jurídicas)",
    route: "/pessoas",
    icon: IconUserFilled,
    category: "organizacao",
    permissionBase: "pessoas",
    featureFlag: "modules.organizacao.pessoas.visualizar",
    defaultEnabled: true,
  },
  {
    key: "fornecedores",
    label: "Fornecedores",
    route: "/fornecedores",
    icon: IconTruck,
    category: "organizacao",
    permissionBase: "fornecedores",
    featureFlag: "modules.organizacao.fornecedores.visualizar",
    defaultEnabled: true,
  },

  // Inventário / financeiro genérico
  {
    key: "unidade-medida",
    label: "Unidade de Medida",
    route: "/unidades-medidas",
    icon: IconRuler,
    category: "inventario",
    permissionBase: "unidade-medida",
    featureFlag: "modules.inventario.unidadeMedida.visualizar",
    defaultEnabled: true,
  },
  {
    key: "grupos-itens",
    label: "Grupos de Itens",
    route: "/grupos-itens",
    icon: IconFolders,
    category: "inventario",
    permissionBase: "grupos-itens",
    featureFlag: "modules.inventario.gruposItens.visualizar",
    defaultEnabled: true,
  },
  {
    key: "sub-grupos-itens",
    label: "Sub Grupos de Itens",
    route: "/sub-grupos-itens",
    icon: IconBoxMultiple,
    category: "inventario",
    permissionBase: "sub-grupos-itens",
    featureFlag: "modules.inventario.subGruposItens.visualizar",
    defaultEnabled: true,
  },
  {
    key: "itens",
    label: "Itens",
    route: "/itens",
    icon: IconBox,
    category: "inventario",
    permissionBase: "itens",
    featureFlag: "modules.inventario.itens.visualizar",
    defaultEnabled: true,
  },
  {
    key: "deposito",
    label: "Depósitos",
    route: "/depositos",
    icon: IconBuildingWarehouse,
    category: "inventario",
    permissionBase: "deposito",
    featureFlag: "modules.inventario.deposito.visualizar",
    defaultEnabled: true,
  },
  {
    key: "tabelas-precos",
    label: "Tabelas de Preço",
    route: "/tabelas-precos",
    icon: IconTableOptions,
    category: "inventario",
    permissionBase: "tabelas-precos",
    featureFlag: "modules.inventario.tabelasPrecos.visualizar",
    defaultEnabled: true,
  },
  {
    key: "centros-custos",
    label: "Centro de Custos",
    route: "/centros-custos",
    icon: IconReportMoney,
    category: "inventario",
    permissionBase: "centros-custos",
    featureFlag: "modules.inventario.centrosCustos.visualizar",
    defaultEnabled: true,
  },
  {
    key: "formas-pagamentos",
    label: "Formas de Pagamento",
    route: "/formas-pagamentos",
    icon: IconCoins,
    category: "inventario",
    permissionBase: "formas-pagamentos",
    featureFlag: "modules.inventario.formasPagamento.visualizar",
    defaultEnabled: true,
  },
  {
    key: "motivos-trocas",
    label: "Motivos de Trocas",
    route: "/motivos-trocas",
    icon: IconArrowsExchange,
    category: "inventario",
    permissionBase: "motivos-trocas",
    featureFlag: "modules.inventario.motivosTrocas.visualizar",
    defaultEnabled: true,
  },
];

const disabledModuleKeys = new Set(
  (process.env.NEXT_PUBLIC_DISABLED_MODULES || "")
    .split(",")
    .map((key) => key.trim())
    .filter(Boolean),
);

export const MODULE_REGISTRY: ModuleDefinition[] = MODULE_DEFINITIONS;

export function isModuleEnabled(module: ModuleDefinition): boolean {
  return module.defaultEnabled && !disabledModuleKeys.has(module.key);
}

export function getEnabledModules(category?: ModuleCategory): ModuleDefinition[] {
  return MODULE_REGISTRY.filter(
    (module) =>
      (!category || module.category === category) && isModuleEnabled(module),
  );
}
