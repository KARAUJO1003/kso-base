import type { Metadata } from "next";
import { MarketingHeader } from "@/components/shared/marketing-header";
import { getBlockItems } from "@/lib/registry/get-registry";
import { routeForRegistryItem } from "@/lib/registry/route-from-page-path";
import { BlocksGallery, type GalleryBlock } from "@/components/registry/blocks-gallery";

export const metadata: Metadata = {
  title: "Blocks",
  description: "Módulos prontos, com preview ao vivo e instalação seletiva via @kso.",
};

export default function BlocksPage() {
  const blocks: GalleryBlock[] = getBlockItems().map((item) => ({
    name: item.name,
    title: item.title,
    description: item.description,
    route: routeForRegistryItem(item),
    packageName: `@kso/${item.name}`,
    category: item.categories?.[0] ?? "outros",
  }));

  return (
    <div className="flex min-h-screen flex-col">
      <MarketingHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-12 md:px-6">
        <h1 className="text-4xl font-semibold tracking-tight">Blocks</h1>
        <p className="mt-2 text-muted-foreground">
          Módulos prontos, com preview ao vivo e instalação seletiva via{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 text-sm">@kso</code>.
        </p>

        <div className="mt-8">
          <BlocksGallery blocks={blocks} />
        </div>
      </main>
    </div>
  );
}
