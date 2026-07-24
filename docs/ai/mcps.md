# MCPs, Plugins E Skills Externas

Este projeto usa uma politica de veto antes de instalar qualquer skill, plugin
ou MCP externo. O objetivo e evitar conflito com o design system, a arquitetura
modular e o uso do repo como template.

## Disponiveis Atualmente

- GitHub: inspecao de repositorios, PRs, issues, checks e publicacao.
- Browser: abertura, navegacao, screenshot e verificacao visual local.
- Documents: criacao e revisao de documentos.
- Spreadsheets: criacao, analise e revisao de planilhas.
- Presentations: criacao e revisao de apresentacoes.
- `node_repl`: execucao JavaScript/Node para inspecoes, validacoes e scripts
  leves.

## Politica De Veto

Antes de adicionar qualquer terceiro:

- Verificar se resolve um problema recorrente do projeto.
- Verificar se nao duplica capacidade ja coberta por Codex, Browser, GitHub ou
  `node_repl`.
- Verificar manutencao, origem e escopo de permissoes.
- Verificar se nao incentiva editar `src/components/ui` diretamente.
- Verificar se respeita Next/React atuais e futuro upgrade.
- Registrar motivo, uso esperado e rollback.

## Candidatos Para Avaliar

- Next/React development: ajuda com padroes de App Router, Server Components,
  Client Components e upgrades.
- Tailwind/design-system: ajuda para tokens, temas, shadcn e consistencia de UI.
- Playwright/E2E: testes de fluxos, screenshots e responsividade.
- A11y testing: acessibilidade em formularios, tabelas, modais e navegacao.
- shadcn registry/tooling: suporte a CLI, registries e atualizacao de
  componentes.

## Nao Fazer Ainda

- Nao instalar MCP externo sem revisao.
- Nao colocar tokens, credenciais ou URLs privadas neste arquivo.
- Nao transformar skills de terceiros em regra oficial sem adaptar aos padroes
  locais.
