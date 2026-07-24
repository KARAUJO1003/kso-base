import { getDoc } from "@/lib/docs/get-doc";
import { DocPager } from "@/components/docs/doc-pager";

export async function generateMetadata() {
  const { frontmatter } = await getDoc("");
  return { title: frontmatter.title, description: frontmatter.description };
}

export default async function DocsIndexPage() {
  const { content } = await getDoc("");
  return (
    <article className="max-w-3xl">
      {content}
      <DocPager slug="" />
    </article>
  );
}
