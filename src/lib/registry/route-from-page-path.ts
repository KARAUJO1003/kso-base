/**
 * Deriva a URL real de uma rota a partir do caminho de um arquivo page.tsx
 * (ex: "src/app/(root)/(cadastros)/lojas/page.tsx" -> "/lojas",
 * "src/app/(root)/users/(pages)/roles/page.tsx" -> "/users/roles"),
 * removendo os segmentos de route group `(algo)`.
 */
export function routeFromPagePath(path: string): string | null {
  const match = path.match(/^src\/app\/(.+)\/page\.tsx$/);
  if (!match) return null;

  const segments = match[1]
    .split("/")
    .filter((segment) => !(segment.startsWith("(") && segment.endsWith(")")));

  return "/" + segments.join("/");
}

/** Mesma coisa, mas a partir da lista `files` de um item do registry.json. */
export function routeForRegistryItem(item: { files?: { path: string }[] }): string | null {
  const pageFile = item.files?.find((file) => file.path.endsWith("/page.tsx"));
  if (!pageFile) return null;
  return routeFromPagePath(pageFile.path);
}
