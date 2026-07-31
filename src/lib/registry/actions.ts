"use server";

import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { getRegistryItem } from "./get-registry";
import { highlightCode } from "./highlight-code";

function languageFromPath(path: string) {
  const ext = path.split(".").pop() ?? "tsx";
  if (ext === "mjs" || ext === "cjs") return "js";
  return ext;
}

/**
 * Busca sob demanda (Server Action) o código destacado dos arquivos de um
 * item do registry — só roda quando o usuário troca pra aba "Code" de um
 * card em /blocks, evitando destacar os arquivos de todos os blocks da
 * categoria de uma vez só no carregamento da página.
 */
export async function getHighlightedFiles(name: string) {
  const item = getRegistryItem(name);
  if (!item?.files?.length) return [];

  return Promise.all(
    item.files.map(async (file) => {
      const raw = await readFile(join(process.cwd(), file.path), "utf8");
      const html = await highlightCode(raw, languageFromPath(file.path));
      return { path: file.path, raw, html };
    }),
  );
}
