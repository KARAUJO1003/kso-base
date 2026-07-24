import type { Metadata } from "next";
import { DocsSiteHeader } from "@/components/docs/site-header";
import { CHANGELOG } from "@/lib/changelog";

export const metadata: Metadata = {
  title: "Changelog",
};

function formatDate(iso: string) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export default function ChangelogPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <DocsSiteHeader />
      <div className="mx-auto w-full max-w-3xl flex-1 px-4 py-12 md:px-6">
        <h1 className="text-4xl font-semibold tracking-tight">Changelog</h1>
        <p className="mt-2 text-muted-foreground">
          Novidades do kso-base, release a release.
        </p>

        <div className="mt-12 space-y-16">
          {CHANGELOG.map((entry) => (
            <article key={entry.version} className="relative border-t pt-8 first:border-t-0 first:pt-0">
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="rounded-full border px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                  v{entry.version}
                </span>
                <time className="text-sm text-muted-foreground" dateTime={entry.date}>
                  {formatDate(entry.date)}
                </time>
              </div>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight">{entry.title}</h2>
              <p className="mt-2 leading-relaxed text-muted-foreground">{entry.summary}</p>
              <ul className="mt-4 ml-5 list-disc space-y-2 text-sm leading-relaxed">
                {entry.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
