import { IconChartPieFilled } from "@tabler/icons-react";
import type { FlagKeyType } from "@/lib/feature-flags/feature-flag";
import {
  getEnabledModules,
  type ModuleDefinition,
} from "@/modules/registry";

/**
 * Sidebar derivada de src/modules/registry.ts — cada módulo já traz seu
 * ícone, feature flag e permissão. Para adicionar/remover um módulo do
 * menu, edite o registry, não este arquivo.
 */
function toSidebarItem(module: ModuleDefinition) {
  return {
    title: module.label,
    url: module.route,
    icon: module.icon,
    disabled: false,
    featureFlag: module.featureFlag,
    permission: `${module.permissionBase}:ver` as const,
  };
}

export const SIDEBAR_PAGES = {
  user: {
    name: "Username",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Painel Administrativo",
      disabled: false,
      url: "/dashboard",
      icon: IconChartPieFilled,
      featureFlag: "modules.dashboard.visualizar" as FlagKeyType,
      permission: "dashboard:ver" as const,
    },
  ],
  organizacao: getEnabledModules("organizacao").map(toSidebarItem),
  inventario: getEnabledModules("inventario").map(toSidebarItem),
  administrativo: getEnabledModules("administrativo").map(toSidebarItem),
};
