"use client";
import * as React from "react";

import { NavMain } from "@/components/sidebar/nav-main";
import { NavUser } from "@/components/sidebar/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { siteConfig } from "@/config/site-config";
import { useFilteredSidebarItemsState } from "@/hooks/use-filtered-sidebar-items";
import { TeamSwitcher } from "./store-switcher";

const GROUP_LABELS = {
  organizacao: "Organização",
  inventario: "Inventário",
  administrativo: "Controle de Usuários",
} as const;

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const allItems = React.useMemo(
    () => [
      ...siteConfig.sidebarRootItems.navMain,
      ...siteConfig.sidebarRootItems.organizacao,
      ...siteConfig.sidebarRootItems.inventario,
      ...siteConfig.sidebarRootItems.administrativo,
    ],
    [],
  );
  const { items: visibleItems, isLoading: isMenuLoading } =
    useFilteredSidebarItemsState(allItems);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="border-sidebar-border border-b">
        <React.Suspense
          fallback={<div className="bg-sidebar-accent rounded w-full h-7" />}
        >
          <TeamSwitcher />
        </React.Suspense>
      </SidebarHeader>
      <SidebarContent>
        <React.Suspense>
          <NavMain items={siteConfig.sidebarRootItems.navMain} />
          <NavMain
            label={GROUP_LABELS.organizacao}
            items={siteConfig.sidebarRootItems.organizacao}
            collapsible
          />
          <NavMain
            label={GROUP_LABELS.inventario}
            items={siteConfig.sidebarRootItems.inventario}
            collapsible
          />
          <NavMain
            label={GROUP_LABELS.administrativo}
            items={siteConfig.sidebarRootItems.administrativo}
            collapsible
          />
          {!isMenuLoading && visibleItems.length === 0 && (
            <SidebarGroup>
              <SidebarGroupContent className="px-2 py-3 text-sidebar-foreground/70 text-sm">
                Nenhum módulo disponível para seu usuário.
              </SidebarGroupContent>
            </SidebarGroup>
          )}
        </React.Suspense>
      </SidebarContent>
      <SidebarFooter className="border-sidebar-border border-t">
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
