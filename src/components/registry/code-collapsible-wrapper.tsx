"use client";

/**
 * Adaptado de components/code-collapsible-wrapper.tsx do repo real
 * shadcn-ui/ui (apps/v4) — mesmo padrão visual (fade + botão
 * Expandir/Recolher), trocando Radix por @/components/ui/collapsible
 * (base-ui): `keepMounted` no lugar de `forceMount`.
 */
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

export function CodeCollapsibleWrapper({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const [isOpened, setIsOpened] = useState(false);

  return (
    <Collapsible
      open={isOpened}
      onOpenChange={setIsOpened}
      className={cn("group/collapsible relative", className)}
    >
      <CollapsibleTrigger
        render={
          <button
            type="button"
            className="absolute right-2.5 top-2.5 z-10 rounded-md border border-white/10 bg-white/5 px-2 py-1 text-xs font-medium text-neutral-300 hover:bg-white/10"
          >
            {isOpened ? "Recolher" : "Expandir"}
          </button>
        }
      />
      <CollapsibleContent
        keepMounted
        className="relative mt-0 overflow-hidden data-[state=closed]:max-h-64"
      >
        {children}
      </CollapsibleContent>
      {!isOpened && (
        <CollapsibleTrigger
          render={
            <button
              type="button"
              className="absolute inset-x-0 -bottom-2 flex h-20 items-center justify-center rounded-b-lg bg-gradient-to-b from-transparent to-[#0d1117] text-sm text-muted-foreground"
            >
              Expandir
            </button>
          }
        />
      )}
    </Collapsible>
  );
}
