"use client";
import { useEffect, useMemo, useState } from "react";
import { PermissionInput } from "@/lib/auth/types/permissions";
import { useAuthUser } from "@/lib/auth/hooks/use-auth-user";
import { useAbilities } from "@/lib/auth/hooks/use-abilities";
import { isEnabled, FlagKeyType } from "@/lib/feature-flags/feature-flag";

type SidebarAbilities = ReturnType<typeof useAbilities>;

export type SidebarItemConfig = {
  title?: string;
  name?: string;
  url: string;
  disabled?: boolean;
  icon?: any;
  isActive?: boolean;
  items?: SidebarItemConfig[];
  /**
   * Feature flag key para controlar visibilidade do item.
   * Se definido, o item só será exibido se a flag estiver ativa.
   * @example "modules.organizacao.cargos.visualizar"
   */
  featureFlag?: FlagKeyType;
  /**
   * Permissão necessária para visualizar o item.
   * Pode ser uma string ou array de strings no formato "grupo:acao".
   * @example "cargos:ver" ou ["cargos:ver", "cargos:criar"]
   */
  permission?: PermissionInput | PermissionInput[];
  /**
   * Modo de validação quando múltiplas permissões são fornecidas.
   * - "all": usuário precisa ter TODAS as permissões
   * - "any": usuário precisa ter PELO MENOS UMA permissão
   * @default "any"
   */
  permissionMode?: "all" | "any";
};

function canShowItem(item: SidebarItemConfig, abilities: SidebarAbilities) {
  if (item.featureFlag && !isEnabled(item.featureFlag)) {
    return false;
  }

  if (item.permission) {
    const permissions = Array.isArray(item.permission)
      ? item.permission
      : [item.permission];

    const mode = item.permissionMode || "any";
    const hasPermission =
      mode === "all"
        ? abilities.canAll(permissions)
        : abilities.canAny(permissions);

    if (!hasPermission) {
      return false;
    }
  }

  return true;
}

function filterSidebarItems<T extends SidebarItemConfig>(
  items: T[],
  abilities: SidebarAbilities,
): T[] {
  return items?.reduce<T[]>((acc, item) => {
    if (!canShowItem(item, abilities)) {
      return acc;
    }

    const filteredChildren = item.items
      ? filterSidebarItems(item.items, abilities)
      : undefined;

    if (item.items && filteredChildren?.length === 0) {
      return acc;
    }

    acc.push({
      ...item,
      ...(filteredChildren ? { items: filteredChildren } : {}),
    });

    return acc;
  }, []);
}

/**
 * Hook para filtrar itens da sidebar com base em feature flags e permissões.
 *
 * @example
 * ```tsx
 * const filteredItems = useFilteredSidebarItems(siteConfig.sidebarRootItems.navMain);
 * ```
 */
export function useFilteredSidebarItems<T extends SidebarItemConfig>(
  items: T[],
): T[] {
  return useFilteredSidebarItemsState(items).items;
}

export function useFilteredSidebarItemsState<T extends SidebarItemConfig>(
  items: T[],
) {
  const { user, isLoading: isAuthLoading } = useAuthUser();
  const abilities = useAbilities(user?.abilities || [], user?.isAdmin);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const filteredItems = useMemo(() => {
    if (!mounted || isAuthLoading) {
      return [];
    }

    return filterSidebarItems(items, abilities);
  }, [items, mounted, isAuthLoading, user?.abilities, user?.isAdmin, abilities]);

  return {
    items: filteredItems,
    isLoading: !mounted || isAuthLoading,
  };
}
