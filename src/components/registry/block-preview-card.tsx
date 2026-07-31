"use client";

import { useState, useTransition } from "react";
import { MonitorIcon, TabletIcon, SmartphoneIcon, RotateCwIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { CopyButton } from "./copy-button";
import { getHighlightedFiles } from "@/lib/registry/actions";

const VIEWPORTS = {
  desktop: "100%",
  tablet: "768px",
  mobile: "390px",
} as const;

type Viewport = keyof typeof VIEWPORTS;
type HighlightedFile = { path: string; raw: string; html: string };

/**
 * Card de bloco no estilo da página /blocks real do shadcn.com: barra de
 * ferramentas com toggle Preview/Code, botões de viewport, recarregar e o
 * comando de instalação inline — em vez de seções empilhadas (título,
 * instalação, iframe, código) como na primeira versão desta página.
 */
export function BlockPreviewCard({
  name,
  route,
  packageName,
}: {
  name: string;
  route: string | null;
  packageName: string;
}) {
  const [tab, setTab] = useState<"preview" | "code">("preview");
  const [viewport, setViewport] = useState<Viewport>("desktop");
  const [iframeKey, setIframeKey] = useState(0);
  const [files, setFiles] = useState<HighlightedFile[] | null>(null);
  const [activeFile, setActiveFile] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleShowCode() {
    setTab("code");
    if (!files) {
      startTransition(async () => {
        const result = await getHighlightedFiles(name);
        setFiles(result);
        setActiveFile(result[0]?.path ?? null);
      });
    }
  }

  const command = `npx shadcn add ${packageName}`;
  const activeFileContent = files?.find((file) => file.path === activeFile);

  return (
    <div className="overflow-hidden rounded-xl border">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b bg-muted/30 px-3 py-2">
        <div className="flex items-center gap-1 rounded-md bg-muted p-0.5">
          <button
            type="button"
            onClick={() => setTab("preview")}
            className={cn(
              "rounded px-2.5 py-1 text-xs font-medium transition-colors",
              tab === "preview" ? "bg-background shadow-sm" : "text-muted-foreground",
            )}
          >
            Preview
          </button>
          <button
            type="button"
            onClick={handleShowCode}
            className={cn(
              "rounded px-2.5 py-1 text-xs font-medium transition-colors",
              tab === "code" ? "bg-background shadow-sm" : "text-muted-foreground",
            )}
          >
            Code
          </button>
        </div>

        <div className="flex items-center gap-2">
          {tab === "preview" && (
            <div className="hidden items-center gap-0.5 sm:flex">
              {(
                [
                  ["desktop", MonitorIcon],
                  ["tablet", TabletIcon],
                  ["mobile", SmartphoneIcon],
                ] as const
              ).map(([key, Icon]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setViewport(key)}
                  aria-label={key}
                  className={cn(
                    "rounded-md p-1.5 text-muted-foreground hover:bg-muted",
                    viewport === key && "bg-muted text-foreground",
                  )}
                >
                  <Icon className="size-4" />
                </button>
              ))}
              <button
                type="button"
                onClick={() => setIframeKey((key) => key + 1)}
                aria-label="Recarregar"
                className="rounded-md p-1.5 text-muted-foreground hover:bg-muted"
              >
                <RotateCwIcon className="size-4" />
              </button>
            </div>
          )}
          <div className="flex items-center gap-1.5 rounded-md border bg-background px-2 py-1">
            <code className="font-mono text-xs text-muted-foreground">{command}</code>
            <CopyButton
              value={command}
              className="static border-0 bg-transparent p-0.5 text-muted-foreground"
            />
          </div>
        </div>
      </div>

      {tab === "preview" ? (
        route ? (
          <div className="flex justify-center bg-muted/20">
            <div style={{ width: VIEWPORTS[viewport] }} className="w-full">
              <iframe
                key={iframeKey}
                src={route}
                loading="lazy"
                title={name}
                className="h-[600px] w-full border-0 bg-background"
              />
            </div>
          </div>
        ) : (
          <p className="p-6 text-sm text-muted-foreground">Sem rota própria pra pré-visualizar.</p>
        )
      ) : (
        <div className="bg-[#0d1117]">
          {isPending && <p className="p-4 text-sm text-neutral-400">Carregando código...</p>}
          {!isPending && files && (
            <>
              <div className="flex flex-wrap gap-1 border-b border-white/10 p-2">
                {files.map((file) => (
                  <button
                    key={file.path}
                    type="button"
                    onClick={() => setActiveFile(file.path)}
                    className={cn(
                      "rounded px-2 py-1 font-mono text-xs",
                      activeFile === file.path
                        ? "bg-white/10 text-neutral-100"
                        : "text-neutral-400 hover:text-neutral-200",
                    )}
                  >
                    {file.path.split("/").pop()}
                  </button>
                ))}
              </div>
              {activeFileContent && (
                <div className="relative">
                  <div
                    className="max-h-[600px] overflow-auto p-4 text-sm [&_pre]:bg-transparent"
                    dangerouslySetInnerHTML={{ __html: activeFileContent.html }}
                  />
                  <CopyButton value={activeFileContent.raw} className="absolute right-2.5 top-2.5" />
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
