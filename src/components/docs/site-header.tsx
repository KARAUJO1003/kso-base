import Link from "next/link";
import { BoxesIcon } from "lucide-react";
import { ToggleTheme } from "@/components/toggle-theme";
import { brandConfig } from "@/config/brand.config";

const NAV_LINKS = [
  { href: "/docs", label: "Docs" },
  { href: "/changelog", label: "Changelog" },
];

export function DocsSiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-6">
          <Link href="/docs" className="flex items-center gap-2 font-semibold">
            <BoxesIcon className="size-5" />
            <span>{brandConfig.name}</span>
          </Link>
          <nav className="hidden items-center gap-4 text-sm text-muted-foreground md:flex">
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="hover:text-foreground">
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
            Voltar ao app
          </Link>
          <ToggleTheme />
        </div>
      </div>
    </header>
  );
}
