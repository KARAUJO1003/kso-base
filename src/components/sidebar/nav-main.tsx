"use client";
import { type Icon } from "@tabler/icons-react";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  useFilteredSidebarItemsState,
  SidebarItemConfig,
} from "@/hooks/use-filtered-sidebar-items";
import { cn } from "@/lib/utils";
import { ChevronRight, Star } from "lucide-react";

type NavMainItem = SidebarItemConfig & {
  title: string;
  icon?: Icon;
};

export function NavMain({
  items,
  label,
  className,
  hideWhenCollapsed,
  menuClassName,
  collapsible,
  collapsed,
  onCollapsedChange,
  favoriteUrls,
  onToggleFavorite,
  onNavigate,
  activeMode = "strong",
  sectionVariant = "default",
}: {
  items: NavMainItem[];
  label?: string;
  className?: string;
  hideWhenCollapsed?: boolean;
  menuClassName?: string;
  collapsible?: boolean;
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  favoriteUrls?: Set<string>;
  onToggleFavorite?: (item: NavMainItem) => void;
  onNavigate?: (item: NavMainItem) => void;
  activeMode?: "strong" | "subtle" | "none";
  sectionVariant?: "default" | "favorites";
}) {
  const pathname = usePathname();
  const { items: filteredItems, isLoading } =
    useFilteredSidebarItemsState(items);

  function isActive(item: { url: string }) {
    return item.url === pathname;
  }

  const hasActiveItem = filteredItems.some(isActive);
  const isOpen = !collapsible || hasActiveItem || !collapsed;
  const sectionIcon =
    sectionVariant === "favorites" ? (
      <Star className="fill-current size-3.5 text-sidebar-primary" />
    ) : null;
  const sectionClasses = cn(sectionVariant !== "default" && "pb-1");

  if (isLoading) {
    return (
      <SidebarGroup
        className={cn(
          hideWhenCollapsed && "group-data-[collapsible=icon]:hidden",
          sectionClasses,
          className,
        )}
      >
        <SidebarGroupContent className="flex flex-col gap-2">
          {label && (
            <SidebarGroupLabel
              className={cn(
                "gap-1.5",
                sectionVariant === "favorites" &&
                  "text-sidebar-foreground font-semibold",
              )}
            >
              {sectionIcon}
              {label}
            </SidebarGroupLabel>
          )}
          <SidebarMenu className={cn("gap-1", menuClassName)}>
            {Array.from({ length: label ? 3 : 2 }).map((_, index) => (
              <SidebarMenuItem key={index}>
                <div className="flex items-center gap-2 px-2 rounded-md h-8">
                  <Skeleton className="rounded-md size-4 shrink-0" />
                  <Skeleton
                    className={cn(
                      "flex-1 h-4",
                      index === 0 && "max-w-[72%]",
                      index === 1 && "max-w-[58%]",
                      index === 2 && "max-w-[84%]",
                    )}
                  />
                </div>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    );
  }

  if (filteredItems.length === 0) {
    return null;
  }

  return (
    <SidebarGroup
      className={cn(
        hideWhenCollapsed && "group-data-[collapsible=icon]:hidden",
        sectionClasses,
        className,
      )}
    >
      <Collapsible
        open={isOpen}
        onOpenChange={(open) => onCollapsedChange?.(!open)}
      >
        <SidebarGroupContent className="flex flex-col gap-2">
          {label &&
            (collapsible ? (
              <CollapsibleTrigger className="flex items-center gap-1 group-data-[collapsible=icon]:opacity-0 group-data-[collapsible=icon]:-mt-8 px-2 rounded-md outline-hidden ring-sidebar-ring focus-visible:ring-2 h-8 font-medium text-sidebar-foreground/70 text-xs transition-[margin,opacity] duration-200 ease-linear shrink-0">
                <ChevronRight
                  className={cn(
                    "size-3.5 transition-transform",
                    isOpen && "rotate-90",
                  )}
                />
                <span className="truncate">{label}</span>
              </CollapsibleTrigger>
            ) : (
              <SidebarGroupLabel
                className={cn(
                  "gap-1.5",
                  sectionVariant === "favorites" &&
                    "text-sidebar-foreground font-semibold",
                )}
              >
                {sectionIcon}
                {label}
              </SidebarGroupLabel>
            ))}
          <CollapsibleContent>
            <SidebarMenu className={cn("gap-1", menuClassName)}>
              {filteredItems.map((item) => {
                const active = isActive(item);
                const favorite = favoriteUrls?.has(item.url) ?? false;
                const navigable = item.url !== "#";
                const disabled = item.disabled && !navigable;

                return (
                  <SidebarMenuItem key={item.title}>
                    <Link
                      href={navigable ? item.url : "#"}
                      className="w-full h-full"
                      onClick={(event) => {
                        if (disabled) {
                          event.preventDefault();
                          return;
                        }

                        onNavigate?.(item);
                      }}
                    >
                      <SidebarMenuButton
                        isActive={active && activeMode !== "none"}
                        disabled={disabled}
                        tooltip={item.title}
                        className={cn(
                          "before:top-1.5 before:bottom-1.5 before:left-0 before:absolute relative before:bg-transparent hover:bg-sidebar-accent pl-3 before:rounded-full before:w-1 hover:text-sidebar-accent-foreground",
                          activeMode === "strong" &&
                            "data-active:bg-sidebar-primary/15 data-active:text-sidebar-primary data-active:font-semibold data-active:before:bg-sidebar-primary data-active:[&_svg]:text-sidebar-primary",
                          activeMode === "subtle" &&
                            "data-active:bg-sidebar-accent/40 data-active:text-sidebar-accent-foreground data-active:before:bg-sidebar-border",
                        )}
                      >
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </Link>
                    {onToggleFavorite &&
                      sectionVariant !== "favorites" &&
                      item.url !== "#" && (
                        <SidebarMenuAction
                          type="button"
                          aria-label={
                            favorite
                              ? `Remover ${item.title} dos favoritos`
                              : `Favoritar ${item.title}`
                          }
                          showOnHover
                          className={cn(
                            "hover:text-sidebar-primary",
                            favorite &&
                              "opacity-100 md:opacity-100 text-sidebar-primary/70 hover:text-sidebar-primary",
                          )}
                          onClick={(event) => {
                            event.preventDefault();
                            event.stopPropagation();
                            onToggleFavorite(item);
                          }}
                        >
                          <Star className={cn(favorite && "fill-current")} />
                        </SidebarMenuAction>
                      )}
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </CollapsibleContent>
        </SidebarGroupContent>
      </Collapsible>
    </SidebarGroup>
  );
}
