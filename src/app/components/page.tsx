import Link from "next/link";
import type { Metadata } from "next";
import { MarketingHeader } from "@/components/shared/marketing-header";
import { COMPONENT_MANIFEST } from "@/registry/demos/manifest";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Components",
  description: "Componentes de UI com preview ao vivo, código e instalação.",
};

export default function ComponentsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <MarketingHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-12 md:px-6">
        <h1 className="text-4xl font-semibold tracking-tight">Components</h1>
        <p className="mt-2 text-muted-foreground">
          Componentes de UI com preview ao vivo, código e instalação.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {COMPONENT_MANIFEST.map((entry) => (
            <Link key={entry.name} href={`/components/${entry.name}`}>
              <Card className="h-full transition-colors hover:border-primary/50">
                <CardHeader>
                  <CardTitle>{entry.title}</CardTitle>
                  <CardDescription>{entry.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
