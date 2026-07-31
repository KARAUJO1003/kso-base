import { MarketingHeader } from "@/components/shared/marketing-header";
import { DocsSidebar } from "@/components/docs/docs-sidebar";

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <MarketingHeader />
      <div className="mx-auto flex w-full max-w-6xl flex-1 gap-10 px-4 py-8 md:px-6">
        <aside className="hidden w-56 shrink-0 md:block">
          <div className="sticky top-20">
            <DocsSidebar />
          </div>
        </aside>
        <main className="min-w-0 flex-1 pb-16">{children}</main>
      </div>
    </div>
  );
}
