import type { ComponentType } from "react";
import { ComponentSource } from "./component-source";

/**
 * Adaptado de components/component-preview.tsx + component-preview-tabs.tsx
 * do repo real shadcn-ui/ui (apps/v4), removendo o que não se aplica aqui
 * (troca de base Radix/React Aria/Base UI, RTL) — este projeto só tem uma
 * base (@base-ui/react). Fica: caixa de preview ao vivo + teaser de código
 * colapsável logo abaixo, conectados visualmente.
 */
export function ComponentPreview({
  Demo,
  sourcePath,
}: {
  Demo: ComponentType;
  sourcePath: string;
}) {
  return (
    <div className="mt-4 flex flex-col overflow-hidden rounded-2xl border">
      <div className="flex min-h-72 w-full items-center justify-center p-10">
        <Demo />
      </div>
      <div className="border-t">
        <ComponentSource path={sourcePath} collapsible embedded />
      </div>
    </div>
  );
}
