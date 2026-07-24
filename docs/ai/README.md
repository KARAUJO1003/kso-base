# AI Guide

Este diretorio guarda a memoria operacional do `kso-base` para Codex,
agents, skills, MCPs e ferramentas de IA. Tudo aqui deve ser versionavel,
portatil e seguro para virar base de novos sistemas.

## Como Usar

- Leia `AGENTS.md` antes de alterar arquitetura, UI, formularios ou tabelas.
- Use as skills em `docs/ai/skills` como fonte de regras do projeto.
- Use `agents.md` para escolher o perfil de agente mais adequado para uma tarefa.
- Use `mcps.md` para decidir quais MCPs/plugins estao liberados, quais sao
  candidatos e quais precisam de avaliacao antes de entrar.

## Skills Versionadas

- `kso-base-architecture`: limites entre `app`, `features`, `components`,
  `hooks`, `lib` e providers.
- `kso-base-design-system`: shadcn, `components/ui`, `components/ds`,
  tokens, `globals.css`, `cn` e Tailwind sem acoplamento.
- `kso-base-forms`: padrao de formularios, drawers/sheets, `FormFields`,
  `FieldGroup`, composicao e reducers.
- `kso-base-data-table`: `DataTable`, `createColumnBuilder`, filtros,
  colunas e acoes.
- `kso-base-module-generator`: estrutura plug-and-play de modulos em
  `features` e scripts de geracao.
- `kso-base-review`: checklist de revisao para SOLID, clean code,
  upgrades de Next/React e consistencia visual.

## Convencao De Escopo

- O repositorio guarda a fonte das regras.
- O ambiente global do Codex pode receber instalacoes depois, mas nao deve ser
  considerado fonte de verdade.
- MCPs e skills de terceiros entram apenas apos avaliacao de utilidade,
  seguranca, manutencao e conflito com estes padroes.

## Quando Atualizar Estes Docs

- Ao criar novo padrao de feature, form, tabela, hook ou layout.
- Ao perceber componentes com muitas props e substituir por hook, context local
  ou composition pattern.
- Ao criar painéis laterais operacionais com abas de visualização/criação.
- Ao mover variantes shadcn para `src/components/ds`.
- Ao separar novos tokens/estilos do app fora de `globals.css`.
- Ao adicionar MCP, plugin ou skill externo ao fluxo oficial.
- Ao mudar geradores, scripts de modulo ou convencoes de nomenclatura.
