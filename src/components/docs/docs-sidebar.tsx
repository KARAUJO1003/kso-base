"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { DOCS_NAV } from "@/lib/docs/nav";
import { cn } from "@/lib/utils";

export function DocsSidebar({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <nav className={cn("space-y-6", className)}>
      {DOCS_NAV.map((group) => (
        <div key={group.title}>
          <h4 className="mb-2 text-sm font-semibold text-foreground">{group.title}</h4>
          <ul className="space-y-1 border-l border-border">
            {group.items.map((item) => {
              const href = `/docs${item.slug ? `/${item.slug}` : ""}`;
              const active = pathname === href;
              return (
                <li key={item.slug}>
                  <Link
                    href={href}
                    className={cn(
                      "-ml-px block border-l pl-3 py-1 text-sm transition-colors",
                      active
                        ? "border-primary font-medium text-primary"
                        : "border-transparent text-muted-foreground hover:border-border hover:text-foreground",
                    )}
                  >
                    {item.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
