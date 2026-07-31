"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { BlockPreviewCard } from "./block-preview-card";

export interface GalleryBlock {
  name: string;
  title: string;
  description: string;
  route: string | null;
  packageName: string;
  category: string;
}

const CATEGORY_LABELS: Record<string, string> = {
  cadastros: "Cadastros",
  administrativo: "Administrativo",
};

export function BlocksGallery({ blocks }: { blocks: GalleryBlock[] }) {
  const categories = [...new Set(blocks.map((block) => block.category))];
  const [active, setActive] = useState(categories[0]);

  const visible = blocks.filter((block) => block.category === active);

  return (
    <div>
      <div className="flex items-center gap-6 border-b">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => setActive(category)}
            className={cn(
              "-mb-px border-b-2 border-transparent px-1 pb-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground",
              active === category && "border-foreground text-foreground",
            )}
          >
            {CATEGORY_LABELS[category] ?? category}
          </button>
        ))}
      </div>

      <div className="mt-8 flex flex-col gap-12">
        {visible.map((block) => (
          <div key={block.name}>
            <h2 className="text-lg font-semibold tracking-tight">{block.title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{block.description}</p>
            <div className="mt-3">
              <BlockPreviewCard
                name={block.name}
                route={block.route}
                packageName={block.packageName}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
