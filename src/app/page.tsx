import Link from "next/link";
import { BookOpenIcon, BoxesIcon, HistoryIcon } from "lucide-react";
import { MarketingHeader } from "@/components/shared/marketing-header";
import { HeroCta } from "@/components/shared/hero-cta";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { brandConfig } from "@/config/brand.config";

const SHORTCUTS = [
  {
    href: "/docs",
    icon: BookOpenIcon,
    title: "Docs",
    description: "Arquitetura, módulos, registry e como configurar um projeto novo.",
  },
  {
    href: "/blocks",
    icon: BoxesIcon,
    title: "Blocks",
    description: "Módulos prontos com preview ao vivo e instalação seletiva via @kso.",
  },
  {
    href: "/changelog",
    icon: HistoryIcon,
    title: "Changelog",
    description: "Novidades do kso-base, release a release.",
  },
];

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <MarketingHeader />
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-center gap-16 px-4 py-24 text-center md:px-6">
        <div className="flex flex-col items-center gap-6">
          <h1 className="max-w-2xl text-4xl font-semibold tracking-tight md:text-5xl">
            {brandConfig.name}
          </h1>
          <p className="max-w-xl text-lg text-muted-foreground">
            {brandConfig.description}. Uma base pessoal de templates, blocks
            e componentes para iniciar ou enriquecer projetos novos.
          </p>
          <HeroCta />
        </div>

        <div className="grid w-full gap-4 sm:grid-cols-3">
          {SHORTCUTS.map((shortcut) => (
            <Link key={shortcut.href} href={shortcut.href}>
              <Card className="h-full text-left transition-colors hover:border-primary/50">
                <CardHeader>
                  <shortcut.icon className="size-5 text-muted-foreground" />
                  <CardTitle className="mt-2">{shortcut.title}</CardTitle>
                  <CardDescription>{shortcut.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
