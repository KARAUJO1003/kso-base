# Agents

Perfis recomendados para uso manual ou futuro fluxo multi-agent. Cada agente
deve obedecer `AGENTS.md` e consultar as skills relacionadas em
`docs/ai/skills`.

## Architect Reviewer

Use para revisar arquitetura, limites de modulo, acoplamento com Next/React e
preparacao para upgrades.

- Skills: `kso-base-architecture`, `kso-base-review`
- Foco: paginas finas, features coesas, providers pequenos, hooks reutilizaveis,
  separacao entre dominio, UI e infraestrutura.
- Saida esperada: riscos, arquivos fora do padrao e plano incremental de ajuste.

## Design System Guardian

Use para revisar UI, shadcn, tokens, `components/ui`, `components/ds`,
formularios e consistencia visual.

- Skills: `kso-base-design-system`, `kso-base-forms`
- Foco: variantes fora de `components/ui`, classes condicionais, tokens,
  spacing, layouts de sheet/drawer e compatibilidade com CLI do shadcn.
- Saida esperada: recomendacoes objetivas e migracoes seguras para DS.

## Feature Scaffolder

Use para criar ou revisar novos modulos plug-and-play em `src/features`.

- Skills: `kso-base-module-generator`, `kso-base-architecture`
- Foco: `feature.tsx`, `components/table.tsx`, `table-columns.tsx`, forms,
  modais, query/mutation keys, permissoes e rotas.
- Saida esperada: estrutura de modulo coerente com os geradores e exemplos
  existentes.

## Form/Table Specialist

Use para implementar ou revisar formularios complexos, drawers/sheets,
data-tables, filtros e colunas.

- Skills: `kso-base-forms`, `kso-base-data-table`
- Foco: `FormFields`, `FieldGroup`, `useCrud`, `useLoadOptions`,
  `createColumnBuilder`, filtros funcionais, acoes e selecao.
- Saida esperada: componentes menores, tipagem forte, reducers quando houver
  fluxo complexo e colunas padronizadas.

## Upgrade Compatibility Auditor

Use antes de upgrades de Next, React, Tailwind, shadcn ou React Query.

- Skills: `kso-base-architecture`, `kso-base-design-system`,
  `kso-base-review`
- Foco: APIs instaveis, acoplamentos com framework, efeitos desnecessarios,
  componentes client grandes, CSS global excessivo e dependencias de UI
  customizadas.
- Saida esperada: checklist de risco, ordem de migracao e testes de regressao.
