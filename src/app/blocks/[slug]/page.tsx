import { notFound } from "next/navigation";
import { MarketingHeader } from "@/components/shared/marketing-header";
import { getBlockItems, getRegistryItem } from "@/lib/registry/get-registry";
import { routeForRegistryItem } from "@/lib/registry/route-from-page-path";
import { BlockPreviewCard } from "@/components/registry/block-preview-card";

export function generateStaticParams() {
  return getBlockItems().map((item) => ({ slug: item.name }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = getRegistryItem(slug);
  return { title: item?.title ?? slug, description: item?.description };
}

export default async function BlockDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = getRegistryItem(slug);
  if (!item || item.type !== "registry:block" || !item.files?.length) {
    notFound();
  }

  const route = routeForRegistryItem(item);

  return (
    <div className="flex min-h-screen flex-col">
      <MarketingHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-12 md:px-6">
        <h1 className="text-3xl font-semibold tracking-tight">{item.title}</h1>
        <p className="mt-2 text-muted-foreground">{item.description}</p>

        <div className="mt-6">
          <BlockPreviewCard name={item.name} route={route} packageName={`@kso/${item.name}`} />
        </div>
      </main>
    </div>
  );
}
