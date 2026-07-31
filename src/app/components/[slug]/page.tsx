import { notFound } from "next/navigation";
import { MarketingHeader } from "@/components/shared/marketing-header";
import { COMPONENT_MANIFEST, getComponentManifestEntry } from "@/registry/demos/manifest";
import { ComponentPreview } from "@/components/registry/component-preview";
import { ComponentSource } from "@/components/registry/component-source";
import { InstallCommand } from "@/components/registry/install-command";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function generateStaticParams() {
  return COMPONENT_MANIFEST.map((entry) => ({ slug: entry.name }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const entry = getComponentManifestEntry(slug);
  return { title: entry?.title ?? slug, description: entry?.description };
}

export default async function ComponentDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = getComponentManifestEntry(slug);
  if (!entry) notFound();

  return (
    <div className="flex min-h-screen flex-col">
      <MarketingHeader />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-12 md:px-6">
        <h1 className="text-3xl font-semibold tracking-tight">{entry.title}</h1>
        <p className="mt-2 text-muted-foreground">{entry.description}</p>

        <ComponentPreview Demo={entry.Demo} sourcePath={entry.file} />

        <h2 className="mt-12 text-xl font-semibold tracking-tight">Installation</h2>
        <Tabs defaultValue="command" className="mt-4">
          <TabsList>
            <TabsTrigger value="command">Command</TabsTrigger>
            <TabsTrigger value="manual">Manual</TabsTrigger>
          </TabsList>
          <TabsContent value="command" className="mt-4">
            <InstallCommand packageName={entry.packageName} />
          </TabsContent>
          <TabsContent value="manual" className="mt-4">
            <ol className="list-decimal space-y-4 pl-5 text-sm">
              <li>
                <p className="mb-2">Copie o código abaixo para dentro do seu projeto.</p>
                <ComponentSource path={entry.file} title={entry.file} collapsible={false} />
              </li>
            </ol>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
