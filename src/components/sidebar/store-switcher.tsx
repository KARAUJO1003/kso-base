"use client";
import { CheckCircleIcon, ChevronsUpDown, RefreshCw } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useStore } from "@/contexts/store-context";
import { useAuth } from "@/lib/auth/hooks/use-auth";
import { Skeleton } from "../ui/skeleton";
import { FeaturedIcon } from "../layout/featured-icon";
import { BrandLogo } from "../ds/brand-logo";
import { brandConfig } from "@/config/brand.config";

export function TeamSwitcher() {
  const { isMobile, state } = useSidebar();
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const storeCtx = useStore();
  const stores = storeCtx.stores ?? [];
  const hasStores = stores.length > 0;
  const hasUpdateError = storeCtx.onUpdateStoreMutation?.isError ?? false;
  const cannotSelectStore =
    isAuthLoading ||
    !isAuthenticated ||
    !user?._id ||
    storeCtx.isLoading ||
    storeCtx.isError;

  function handleStoreChange(storeId: string) {
    if (!storeId || !user?._id || storeCtx.isUpdating) return;
    storeCtx.onUpdateStoreMutation?.mutate({
      formData: { loja: storeId },
      id: user._id,
    });
  }

  function getTriggerLabel() {
    if (isAuthLoading || storeCtx.isLoading) return "Carregando lojas...";
    if (!isAuthenticated || !user?._id) return "Usuário não identificado";
    if (storeCtx.isError) return "Erro ao carregar lojas";
    if (storeCtx.isUpdating) return "Alterando loja...";
    if (!storeCtx.selectedStore?.nome) return "Sem loja";

    return storeCtx.selectedStore.nome;
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            data-state={state}
            render={
              <SidebarMenuButton
                size={state === "collapsed" ? "icon" : "default"}
                className="group-data-[collapsible=icon]:p-1! py-1 h-auto"
              />
            }
          >
            <span className="flex justify-center items-center size-6 [&_svg]:size-full! shrink-0">
              <BrandLogo
                variant="symbol"
                aria-label={brandConfig.name}
                className="size-5!"
              />
            </span>
            <div className="flex-1 grid text-base text-left leading-tight">
              {isAuthLoading || storeCtx.isLoading ? (
                <Skeleton className="w-full h-7" />
              ) : (
                <span className="font-medium truncate">{getTriggerLabel()}</span>
              )}
            </div>

            <ChevronsUpDown className="ml-auto" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuGroup className="flex flex-col gap-1">
              <DropdownMenuLabel>
                Lojas {hasStores ? stores.length : ""}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {isAuthLoading || storeCtx.isLoading ? (
                Array.from({ length: 3 }).map((_, index) => (
                  <DropdownMenuItem key={index} disabled>
                    <Skeleton className="w-full h-5" />
                  </DropdownMenuItem>
                ))
              ) : storeCtx.isError ? (
                <>
                  <DropdownMenuItem disabled className="whitespace-normal">
                    Não foi possível carregar as lojas.
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="justify-center gap-2 font-medium text-primary"
                    onClick={() => storeCtx.refetch()}
                  >
                    <RefreshCw className="size-4" />
                    Tentar novamente
                  </DropdownMenuItem>
                </>
              ) : !isAuthenticated || !user?._id ? (
                <DropdownMenuItem disabled className="whitespace-normal">
                  Usuário não identificado. Entre novamente para selecionar uma loja.
                </DropdownMenuItem>
              ) : hasStores ? (
                stores.map((store) => {
                  const selected = store._id === storeCtx.selectedStore?._id;
                  return (
                    <DropdownMenuItem
                      key={store._id}
                      className="flex justify-between gap-2 aria-selected:bg-muted w-full h-fit aria-selected:pointer-events-none"
                      aria-selected={selected}
                      disabled={cannotSelectStore || storeCtx.isUpdating}
                      onClick={() => handleStoreChange(store._id)}
                    >
                      {store.nome}
                      {selected && (
                        <FeaturedIcon size="xxs" variant="ghost">
                          <CheckCircleIcon />
                        </FeaturedIcon>
                      )}
                    </DropdownMenuItem>
                  );
                })
              ) : (
                <>
                  <DropdownMenuItem disabled className="justify-center">
                    <div className="font-medium text-primary text-center">
                      Nenhuma loja disponível para seu usuário
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="justify-center gap-2 font-medium text-primary"
                    onClick={() => storeCtx.refetch()}
                  >
                    <RefreshCw className="size-4" />
                    Tentar novamente
                  </DropdownMenuItem>
                </>
              )}
              {storeCtx.isUpdating && (
                <DropdownMenuItem disabled className="justify-center">
                  Alterando loja...
                </DropdownMenuItem>
              )}
              {hasUpdateError && (
                <DropdownMenuItem disabled className="whitespace-normal">
                  Não foi possível alterar a loja. Tente novamente.
                </DropdownMenuItem>
              )}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
