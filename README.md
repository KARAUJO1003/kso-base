# kso-base

Template Next.js reutilizável para sistemas administrativos internos:
autenticação, controle de usuários/papéis/permissões e um conjunto de
módulos de cadastro genéricos (organização + inventário/financeiro), prontos
para ligar/desligar por cliente.

Veja [`PROJECT.md`](./PROJECT.md) para o que este projeto é e a lista completa
de módulos, e [`AGENTS.md`](./AGENTS.md) se você é uma IA/agente trabalhando
neste repositório.

## Começando

```bash
npm install
cp .env.example .env.local
# preencha NEXT_PUBLIC_BRAND_* e a URL da API em .env.local
npm run dev
```

Abra `http://localhost:3000/login`.

## Documentação

- [`PROJECT.md`](./PROJECT.md) — o que é este projeto, módulos incluídos, como
  configurar por cliente.
- [`DESIGN.md`](./DESIGN.md) — base visual (tokens, tipografia, camadas de UI)
  a manter consistente entre projetos derivados.
- [`docs/ui-layers.md`](./docs/ui-layers.md) — regra de camadas `ui` / `ds` /
  tokens CSS (por que não editar `components/ui` à mão).
- [`docs/plugin-play-strategy.md`](./docs/plugin-play-strategy.md) — decisões
  de arquitetura por trás deste template.
- [`docs/ai/`](./docs/ai/README.md) — skills e perfis de agente para IA
  trabalhar neste repositório.

## Criar um módulo novo

```bash
npm run generate:module
```

Depois registre o módulo em `src/modules/registry.ts` (ver
[`docs/ai/skills/module-generator`](./docs/ai/skills/module-generator/SKILL.md)).

## Ligar/desligar um módulo por cliente

Adicione a `key` do módulo (ver `src/modules/registry.ts`) na variável
`NEXT_PUBLIC_DISABLED_MODULES` do `.env`, separada por vírgula.
