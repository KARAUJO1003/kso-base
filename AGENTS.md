# kso-base Agent Guide

Use este arquivo como ponto de entrada para qualquer agente (IA ou humano)
trabalhando neste repositorio. `kso-base` e um projeto-template: a base deve
continuar generica o suficiente para virar qualquer sistema administrativo
novo. As regras detalhadas ficam em `docs/ai`.

## O que e este projeto

Ver `PROJECT.md` para o contexto completo. Resumo: um template Next.js com
autenticacao, controle de usuarios/papeis/permissoes, um conjunto de modulos
de cadastro genericos (organizacao + inventario/financeiro) e um gerador de
modulos (`npm run generate:module`). Nenhum modulo especifico de um dominio de
negocio (hotelaria, varejo, etc.) deve entrar aqui — isso e responsabilidade
do projeto derivado.

## Prioridades

- Preservar a arquitetura existente: paginas em `src/app` devem ser finas e
  delegar comportamento para `src/features`.
- Manter todos os modulos de negocio em `src/features`.
- Todo modulo tem uma unica entrada em `src/modules/registry.ts` (rota,
  icone, permissao, feature flag, `defaultEnabled`). Sidebar e o toggle
  `NEXT_PUBLIC_DISABLED_MODULES` sao derivados dessa fonte — nunca duplique
  essa informacao em outro lugar.
- Nao alterar `src/components/ui` ou `src/components/reui` a mao — sao
  vendored (shadcn CLI / registries). Extensoes e variantes do app vao em
  `src/components/ds`. Ver `docs/ui-layers.md`.
- Customizacao visual (cor, tom) so via `src/themes/brand.css` (tokens base,
  nomes neutros). `src/themes/globals.css` e a camada semantica e nao deveria
  precisar de edicao por cliente. Ver `DESIGN.md`.
- Branding textual (titulo, nome, descricao, redes sociais) vem de
  `src/config/brand.config.ts`, lido de variaveis `NEXT_PUBLIC_BRAND_*` —
  nunca hardcode nome de cliente/produto em componente.
- Funcionalidades pesadas e opcionais (`websocket`, `pwa`, `offline`) ficam
  atras de flags em `src/lib/feature-flags/flags.config.ts`. O subsistema
  offline e um stub proposital (ver `src/lib/offline/utils.ts`) — nao
  implementado neste template.
- Preferir composicao, tipagem generica e props herdadas de componentes base
  ou elementos nativos.
- Se um modulo ou componente comecar a receber muitas props, buscar uma
  alternativa antes de continuar: custom hook, context local da feature,
  componentes por composicao, compound components ou outra abordagem que
  reduza acoplamento e melhore manutencao.
- Sempre buscar reutilizar componentes, hooks e padroes existentes no projeto
  antes de criar novos.
- Usar `cn({ "classe": condicao })` para classes condicionais.
- Evitar `useState` e `useEffect` sem necessidade. Use `useReducer` quando o
  estado tem varias variaveis relacionadas ou fluxo com transicoes.
- Padronizar formularios com `react-hook-form`, `zod`, `FormProvider`,
  `FormFields` e layouts consistentes de sheet/drawer.
- Padronizar tabelas com `DataTable`, `createColumnBuilder`, filtros
  funcionais e colunas reutilizaveis.

## Skills Do Projeto

As skills versionadas ficam em `docs/ai/skills`:

- `kso-base-architecture`
- `kso-base-design-system`
- `kso-base-forms`
- `kso-base-data-table`
- `kso-base-module-generator`
- `kso-base-review`

Estas skills sao fonte de verdade do template, mas nao sao instaladas
globalmente. Para uso automatico, instale ou vincule explicitamente depois.

## Referencias

- `PROJECT.md`: o que e este projeto, modulos incluidos, como configurar por
  cliente.
- `DESIGN.md`: base visual (tokens, tipografia, camadas de UI) a manter
  consistente entre projetos derivados.
- `docs/ui-layers.md`: regra de camadas `ui` / `ds` / tokens CSS.
- `docs/plugin-play-strategy.md`: decisoes de arquitetura por tras deste
  template (por que existe, o que foi deixado de fora, proximos passos).
- `docs/ai/README.md`: mapa geral de IA, skills, agents e MCPs.
- `docs/ai/agents.md`: perfis de agentes recomendados.
- `docs/ai/mcps.md`: MCPs/plugins disponiveis, candidatos e politica de veto.
