export interface ChangelogEntry {
  version: string;
  date: string; // ISO
  title: string;
  summary: string;
  items: string[];
}

/**
 * Curado a partir do histórico real de commits — não é uma cópia literal das
 * mensagens de commit. Ao adicionar um release novo, escreva a entrada aqui
 * (mais recente primeiro).
 */
export const CHANGELOG: ChangelogEntry[] = [
  {
    version: "0.4.0",
    date: "2026-07-24",
    title: "Modo demo: dados fake, docs e changelog",
    summary:
      "O template agora roda sem backend nenhum — bom para publicar uma prévia navegável (ex: Vercel) ou para começar um projeto novo antes da API real existir.",
    items: [
      "Motor de mock centralizado (src/lib/mock/) — troca o adapter do axios por um banco fake gerado com @faker-js/faker, sem tocar em nenhum hook/feature.",
      "As 22 entidades do sistema (cadastros + usuários/papéis/permissões) ganharam factories fiéis aos tipos reais, com referência cruzada entre coleções.",
      "Flag NEXT_PUBLIC_DISABLE_AUTH pula o fluxo de login inteiro (middleware + useAuthUser) para o modo demo.",
      "Site de documentação em /docs (MDX, visual inspirado no shadcn/ui) cobrindo arquitetura, módulos, forms/tabelas, permissões, registry e o próprio mecanismo de mock.",
      "Esta página de changelog.",
    ],
  },
  {
    version: "0.3.0",
    date: "2026-07-24",
    title: "Registry privado de componentes (@kso)",
    summary:
      "Piloto de um registry shadcn próprio para instalar módulos ou componentes deste template em outro projeto, seletivamente — sem clonar o repo inteiro.",
    items: [
      "registry.json + pipeline em scripts/registry/ que traça o grafo real de imports (em vez de assumido) para descobrir dependências entre módulos.",
      "@kso/base publicado com o kernel compartilhado (hooks, contexts, DataTable, FormFields, permissões, feature flags).",
      "6 módulos de cadastro publicados (lojas, depositos, tabelas-precos, itens, grupos-itens, unidade-medida) mais @kso/cadastros como atalho e @kso/image-upload como exemplo de componente standalone.",
    ],
  },
  {
    version: "0.2.0",
    date: "2026-07-24",
    title: "Módulos de cadastro completos",
    summary:
      "Todos os módulos de organização e inventário/financeiro confirmados, mais o cluster de usuários/papéis/permissões.",
    items: [
      "17 módulos de (cadastros): lojas, grupos-lojas, setores, gerências, cargos, colaboradores, pessoas, fornecedores, unidade de medida, grupos/sub-grupos de itens, itens, depósitos, tabelas de preço, centros de custo, formas de pagamento, motivos de trocas.",
      "Cluster de segurança: usuários, papéis, permissões, módulos (grupos de permissão) e sistemas.",
    ],
  },
  {
    version: "0.1.0",
    date: "2026-07-24",
    title: "Scaffold inicial",
    summary: "Primeira versão do template: Next.js App Router, autenticação, camadas de UI e a base de módulos.",
    items: [
      "Next.js 15 + React 19 + TypeScript, Tailwind v4, componentes estilo shadcn/base-ui.",
      "Autenticação por cookie/JWT com middleware, AuthGuard e Can.",
      "src/modules/registry.ts como fonte única de verdade para sidebar, feature flag e permissão por módulo.",
    ],
  },
];
