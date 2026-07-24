# DESIGN.md

> Base visual do template. As seções marcadas com **[por cliente]** devem ser
> revisadas/preenchidas a cada projeto derivado; o resto é a base que mantém
> consistência entre todos os projetos que nascerem daqui.

## Camadas de UI (leia antes de mexer em qualquer componente)

Ver `docs/ui-layers.md` para o detalhe completo. Resumo:

1. `src/components/ui/*` e `src/components/reui/*` — **vendored**, nunca
   editar à mão. Atualiza via `npx shadcn add ...`.
2. `src/components/ds/*` — composição própria. Toda customização de
   comportamento/visual vai aqui, nunca no passo 1.
3. Tokens CSS — única forma permitida de mudar aparência (cor, raio, etc.).

## Tokens — 3 camadas

1. **Base** (`src/themes/brand.css`) — valores crus, nomes neutros:
   `--brand-primary`, `--brand-primary-bright`, `--brand-primary-dark`,
   `--brand-secondary`, `--brand-ink`, `--brand-paper`, `--brand-tint`.
   **[por cliente]** — é o único arquivo que deve mudar para reskinar.
2. **Semântica** (`src/themes/globals.css`) — expressa intenção:
   `--background`, `--foreground`, `--primary`, `--secondary`, `--muted`,
   `--accent`, `--destructive`, `--border`, `--brand-default`, etc. Referencia
   a camada base, não deveria precisar de edição por cliente.
3. **Componente** — tokens específicos de variante (ex: `--button-radius`).
   Ainda não formalizada neste template; crie sob demanda quando um
   componente precisar de override que não é só cor.

Regra: nunca usar valor de cor cru (`#fff`, `bg-red-500`) num componente
quando existe um token semântico equivalente.

## Tipografia

Fontes: Geist (sans, `--font-sans`) e JetBrains Mono (`--font-mono`), carregadas
via `next/font/local` em `src/app/layout.tsx`.

Classes utilitárias em `globals.css` (`@layer components`):
`typography-display`, `typography-h1`..`typography-h4`, `typography-large`,
`typography-lead`, `typography-body`, `typography-small`, `typography-muted`,
`typography-caption`, `typography-overline` — prefira essas classes a
`text-*`/`font-*` soltos quando o texto for um título, corpo ou legenda
padrão de página.

## Ícones

- `@tabler/icons-react` para módulos/sidebar (ver `src/modules/registry.ts`).
- `lucide-react` para ícones de UI genérica (botões, estados, ações).
- Não misture as duas libs no mesmo componente sem motivo.

## Branding não-visual

Nome, título, descrição, redes sociais e desenvolvedor vêm de
`src/config/brand.config.ts`, lido de variáveis `NEXT_PUBLIC_BRAND_*`
(`.env`). **[por cliente]** — preencha essas variáveis, nunca hardcode texto
de marca em componente.

O componente `src/components/ds/brand-logo.tsx` desenha um símbolo abstrato +
o nome da marca (derivado de `brandConfig.name`) como fallback, e usa logo
remota (`useStoreBranding`) quando uma loja/tenant tiver `branding.logo_url`
configurado (branding em runtime, por loja — não confundir com o branding de
build-time do `brand.config.ts`).

## Layout

- `PageContainer` / `PageHeader` / `PageTitle` / `PageDescription` /
  `PageContent` (`src/components/layout/page-container.tsx`) é o contêiner
  padrão de toda página de módulo. Não recrie layout de página a mão.
- Sidebar: `SidebarProvider` + `Sidebar` + `SidebarInset` ficam no
  `layout.tsx` da rota (`src/app/(root)/layout.tsx` via
  `RootLayoutContent`), nunca dentro do conteúdo da feature.
- Formulários: `FormProvider` + `FormFields.*` +
  `Field`/`FieldGroup`/`FieldSet` do shadcn.
- Tabelas: `DataTable` + `createColumnBuilder` (ver
  `docs/ai/skills/data-table`).

## Dark mode

`next-themes` com `attribute="class"`; toda cor deve vir de um token que já
tenha variante `.dark` em `globals.css` — não crie exceção só-light.

## **[por cliente]** Checklist de reskin

- [ ] `src/themes/brand.css` com a paleta do cliente.
- [ ] `.env` com `NEXT_PUBLIC_BRAND_*` preenchido.
- [ ] Rodar a app e conferir header, sidebar, login e um formulário/tabela de
      exemplo em light e dark.
- [ ] Nenhum texto ou cor de outro cliente restando (`grep -ri "corpus"` é o
      tipo de checagem a repetir com o nome do template anterior).
