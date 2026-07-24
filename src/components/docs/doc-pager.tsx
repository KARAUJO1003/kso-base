import Link from "next/link";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import { getAdjacentDocs } from "@/lib/docs/nav";

export function DocPager({ slug }: { slug: string }) {
  const { prev, next } = getAdjacentDocs(slug);
  if (!prev && !next) return null;

  return (
    <div className="mt-10 flex items-center justify-between border-t pt-6 text-sm">
      {prev ? (
        <Link
          href={`/docs${prev.slug ? `/${prev.slug}` : ""}`}
          className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeftIcon className="size-4" />
          {prev.title}
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link
          href={`/docs/${next.slug}`}
          className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground"
        >
          {next.title}
          <ArrowRightIcon className="size-4" />
        </Link>
      ) : (
        <span />
      )}
    </div>
  );
}
