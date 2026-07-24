import { notFound } from "next/navigation";
import { getDoc, getDocSlugs } from "@/lib/docs/get-doc";
import { DocPager } from "@/components/docs/doc-pager";

export async function generateStaticParams() {
  const slugs = await getDocSlugs();
  return slugs.filter(Boolean).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  try {
    const { frontmatter } = await getDoc(slug);
    return { title: frontmatter.title, description: frontmatter.description };
  } catch {
    return {};
  }
}

export default async function DocPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  try {
    const { content } = await getDoc(slug);
    return (
      <article className="max-w-3xl">
        {content}
        <DocPager slug={slug} />
      </article>
    );
  } catch {
    notFound();
  }
}
