export interface DocNavItem {
  slug: string;
  title: string;
}

export interface DocNavGroup {
  title: string;
  items: DocNavItem[];
}

export const DOCS_NAV: DocNavGroup[] = [
  {
    title: "Primeiros passos",
    items: [
      { slug: "", title: "Introdução" },
      { slug: "getting-started", title: "Instalação" },
    ],
  },
  {
    title: "Arquitetura",
    items: [
      { slug: "architecture", title: "Visão geral" },
      { slug: "modules", title: "Módulos" },
      { slug: "forms-and-tables", title: "Forms & DataTable" },
      { slug: "permissions", title: "Auth & permissões" },
    ],
  },
  {
    title: "Extensibilidade",
    items: [
      { slug: "registry", title: "Registry (@kso)" },
      { slug: "mock-data", title: "Dados fake (Faker)" },
      { slug: "deployment", title: "Deploy na Vercel" },
    ],
  },
];

export const DOCS_FLAT: DocNavItem[] = DOCS_NAV.flatMap((group) => group.items);

export function getAdjacentDocs(slug: string) {
  const index = DOCS_FLAT.findIndex((item) => item.slug === slug);
  return {
    prev: index > 0 ? DOCS_FLAT[index - 1] : null,
    next: index >= 0 && index < DOCS_FLAT.length - 1 ? DOCS_FLAT[index + 1] : null,
  };
}
