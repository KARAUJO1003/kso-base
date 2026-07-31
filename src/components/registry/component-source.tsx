import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { highlightCode } from "@/lib/registry/highlight-code";
import { CopyButton } from "./copy-button";
import { CodeCollapsibleWrapper } from "./code-collapsible-wrapper";

function languageFromPath(path: string) {
  const ext = path.split(".").pop() ?? "tsx";
  if (ext === "mjs" || ext === "cjs") return "js";
  return ext;
}

/**
 * Lê e destaca um único arquivo real do disco. Usado tanto no teaser
 * colapsável abaixo do preview ao vivo quanto na seção "Installation" da
 * página de detalhe de /components — mesmo arquivo de origem, sem duplicar
 * conteúdo (ver ComponentSource em component-source.tsx no repo real
 * shadcn-ui/ui, que faz o mesmo a partir de um item de registry).
 */
export async function ComponentSource({
  path,
  title,
  collapsible = true,
  embedded = false,
}: {
  path: string;
  title?: string;
  collapsible?: boolean;
  /** true quando já mora dentro de uma caixa com borda (ex: sob o preview) — sem borda/cantos próprios. */
  embedded?: boolean;
}) {
  const raw = await readFile(join(process.cwd(), path), "utf8");
  const html = await highlightCode(raw, languageFromPath(path));

  const code = (
    <div className="relative">
      {title && (
        <div className="flex items-center gap-2 border-b bg-muted/40 px-4 py-2 font-mono text-xs text-muted-foreground">
          {title}
        </div>
      )}
      <div
        className={
          embedded
            ? "overflow-auto p-4 text-sm [&_pre]:bg-transparent"
            : `overflow-auto border p-4 text-sm [&_pre]:bg-transparent ${title ? "rounded-b-lg" : "rounded-lg"}`
        }
        dangerouslySetInnerHTML={{ __html: html }}
      />
      <CopyButton value={raw} className="absolute right-2.5 top-2.5" />
    </div>
  );

  if (!collapsible) return code;

  return <CodeCollapsibleWrapper>{code}</CodeCollapsibleWrapper>;
}
