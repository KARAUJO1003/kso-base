"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CopyButton } from "./copy-button";

const RUNNERS = {
  npm: "npx",
  pnpm: "pnpm dlx",
  yarn: "yarn dlx",
  bun: "bunx",
} as const;

type PackageManager = keyof typeof RUNNERS;

/** `packageName` já vem resolvido pelo chamador: "@kso/lojas" (registry próprio) ou "card" (shadcn público). */
export function InstallCommand({ packageName }: { packageName: string }) {
  const [pm, setPm] = useState<PackageManager>("npm");

  return (
    <Tabs value={pm} onValueChange={(value) => setPm(value as PackageManager)}>
      <TabsList className="h-9 bg-transparent p-0">
        {(Object.keys(RUNNERS) as PackageManager[]).map((key) => (
          <TabsTrigger key={key} value={key} className="text-xs">
            {key}
          </TabsTrigger>
        ))}
      </TabsList>
      {(Object.keys(RUNNERS) as PackageManager[]).map((key) => {
        const command = `${RUNNERS[key]} shadcn add ${packageName}`;
        return (
          <TabsContent key={key} value={key} className="mt-0">
            <div className="relative rounded-lg border bg-[#0d1117] p-4 pr-12">
              <code className="font-mono text-sm text-neutral-100">{command}</code>
              <CopyButton value={command} className="absolute right-2.5 top-1/2 -translate-y-1/2" />
            </div>
          </TabsContent>
        );
      })}
    </Tabs>
  );
}
