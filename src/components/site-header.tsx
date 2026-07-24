"use client";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ArrowLeft, LogOutIcon } from "lucide-react";
import { ToggleTheme } from "./toggle-theme";
import { useHeader } from "@/contexts/header-context";
import { useAuth } from "@/lib/auth/hooks/use-auth";
import { useTransition } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ButtonGroup } from "./ui/button-group";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export function SiteHeader() {
  const { title } = useHeader();
  const [isPending, startTransition] = useTransition();
  const { signOut, isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  return (
    <header className="flex h-(--header-height) border-b shrink-0 items-center gap-2  transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex items-center gap-1 lg:gap-2 px-4 lg:px-6 w-full">
        <SidebarTrigger className="-ml-1" />
        <Breadcrumb>
          <BreadcrumbList>
            {pathname !== "/" && (
              <>
                <ButtonGroup onClick={() => router.back()}>
                  <Button variant="ghost" size="icon-sm">
                    <ArrowLeft />
                  </Button>
                </ButtonGroup>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">Inicio</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
              </>
            )}
            <BreadcrumbItem>
              <BreadcrumbPage>{title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="flex items-center gap-3 ml-auto">
          <ToggleTheme />
          {isAuthenticated && (
            <Button
              variant="outline"
              className="hidden sm:flex"
              size="xs"
              disabled={isPending}
              onClick={() => {
                startTransition(() => {
                  void signOut();
                });
              }}
            >
              Sair
              <LogOutIcon className="size-4" />
            </Button>
          )}
          {!isAuthenticated && (
            <Button
              className="hidden sm:flex"
              disabled={isPending}
              nativeButton={false}
              render={<Link href="/login" />}
            >
              Entrar
              <LogOutIcon className="size-4" />
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
