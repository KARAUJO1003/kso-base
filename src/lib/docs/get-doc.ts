import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import matter from "gray-matter";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypePrettyCode from "rehype-pretty-code";
import { mdxComponents } from "@/components/docs/mdx-components";

const DOCS_DIR = join(process.cwd(), "content", "docs");

export interface DocFrontmatter {
  title: string;
  description?: string;
}

export async function getDocSlugs(): Promise<string[]> {
  const files = await readdir(DOCS_DIR);
  return files
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(/\.mdx$/, ""))
    .map((slug) => (slug === "index" ? "" : slug));
}

export async function getDoc(slug: string) {
  const fileSlug = slug === "" ? "index" : slug;
  const raw = await readFile(join(DOCS_DIR, `${fileSlug}.mdx`), "utf8");
  const { content, data } = matter(raw);

  const { content: rendered } = await compileMDX<DocFrontmatter>({
    source: content,
    components: mdxComponents,
    options: {
      parseFrontmatter: false,
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [
          rehypeSlug,
          [rehypePrettyCode, { theme: { dark: "github-dark", light: "github-light" } }],
        ],
      },
    },
  });

  return {
    frontmatter: data as DocFrontmatter,
    content: rendered,
  };
}
