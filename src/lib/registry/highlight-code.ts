import { codeToHtml } from "shiki";

/** Mesmo tema usado em src/lib/docs/get-doc.ts (rehype-pretty-code), fora do pipeline MDX. */
export async function highlightCode(code: string, lang = "tsx") {
  return codeToHtml(code, { lang, theme: "github-dark" });
}
