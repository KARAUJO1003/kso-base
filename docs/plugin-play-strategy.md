# Estratégia de base plug-and-play — decisões e desejos (em andamento)

> Este documento é um registro vivo das decisões, preferências e descobertas discutidas
> sobre transformar a base do `corpus-front` num projeto-template escalável, customizável
> e plugável para múltiplos clientes/projetos.
>
> Não é um contrato de execução. Quando algo aqui amadurecer o suficiente, deve virar
> (ou atualizar) um documento formal em [`docs/recreate-minimal-project/`](./recreate-minimal-project/README.md),
> que já é o contrato executável de recriação mínima do projeto.

## Objetivo geral

Um projeto totalmente escalável e customizável, mas com uma base sólida e comum entre
todos os projetos derivados dele. Evitar ao máximo acoplamento desnecessário de libs e de
módulos — a base deve ser plug-and-play, inclusive permitindo ligar/desligar módulos ou
funcionalidades específicas por cliente.

Estratégia escolhida: **opção 2 — template repo** (clonar/partir de um repo-base por
projeto), não monorepo com pacote compartilhado. Isso já está em prática via
`docs/recreate-minimal-project/`.

## Decisões e preferências confirmadas

### 1. Camadas de componentes de UI
- `components/ui/*` — saída crua do `shadcn add` / registries. **Nunca editar à mão.**
  Atualiza rodando o CLI de novo.
- `components/reui/*` — mesma regra: vem de registry externo (`@reui`), tratar como
  vendored/gerado.
- `components/ds/*` — camada própria de composição, por cima de `ui/`. É aqui que toda
  customização de comportamento/composição deve morar.
- Customização de **aparência** só via CSS variables (tema), nunca editando `.tsx` de
  componente.
- Motivo: shadcn não é dependência instalada, é código copiado. "Atualizar" = rodar o CLI
  de novo por cima. Se editar à mão, perde a atualização (ou tem conflito manual). Essa
  disciplina existe hoje na prática (`ds/` já é usado assim), só falta documentar como regra
  oficial do time.

### 2. Design tokens em 3 camadas
Já implementado parcialmente:
- **Base/primitiva** (hoje em `src/themes/brand.css`): valores crus, ex. `--corpus-red`.
- **Semântica** (hoje em `src/themes/globals.css`): expressa intenção, ex.
  `--brand-default: var(--corpus-red)`, `--foreground: var(--corpus-black)`.
- **Componente** (ainda não formalizada): tokens específicos de variante, ex.
  `--button-radius`, `--card-shadow`. Falta essa camada.

Pendência: os tokens base hoje têm o nome do produto atual soldado (`--corpus-red`,
`--corpus-wine`, `--corpus-black`). Para white-label real, renomear para algo neutro
(ex. `--brand-primary-500`) — assim trocar de cliente é só trocar o `brand.css`, sem
precisar entender/renomear nada no `globals.css`.

### 3. Branding — dois níveis
- **Runtime, por loja/tenant dentro do mesmo deploy**: já resolvido e funcionando —
  [`store-brand-provider.tsx`](../src/providers/store-brand-provider.tsx) injeta CSS
  variables a partir do campo `branding` da loja selecionada (logo remota + fallback).
  Não mexer.
- **Build-time, por cliente/deploy**: título, favicon, domínio, cor/logo padrão, redes
  sociais. Hoje hardcoded em [`site-config.ts`](../src/config/site-config.ts)
  ("Corpus Motel | A&A Soluções"). Quero mover tudo isso para `.env` +
  `brand.config.ts`, para que um projeto novo seja "copiar `.env.example`, preencher
  ~10 valores, zero edição de código".

### 4. Módulos plug-and-play (ligar/desligar por cliente)
Já existe parcialmente:
- Cada item do sidebar declara `featureFlag` + `permission` separadamente
  ([`sidebar-menu.config.ts`](../src/config/sidebar-menu.config.ts)).
- [`use-filtered-sidebar-items.ts`](../src/hooks/use-filtered-sidebar-items.ts) já filtra
  por isso.

Falta: um **registro único por módulo** (ex. `src/modules/registry.ts`) com
`{ key, route, sidebarEntry, permissionBase, defaultEnabled }`, em vez dessa informação
espalhada entre sidebar config, `module-utils.ts` de cada feature e rotas. Isso também
abriria caminho para desligar um módulo inteiro por cliente via lista em env/JSON, não só
esconder do menu.

### 5. Desacoplar lógica de negócio do "core" genérico
No [`use-crud.ts`](../src/hooks/use-crud.ts):
- O parâmetro `lojas`/`storeIdLocation` (multi-loja) está embutido dentro do hook
  genérico — deveria ser opt-in/composável (`withStoreScope`), não baked-in.
- A fila offline (`prependOfflineRecord`, etc.) está no mesmo hook — também deveria ser
  opcional, para projetos sem PWA/offline não carregarem esse peso.
- Mensagens de toast hardcoded em PT dentro do hook — centralizar num arquivo de
  mensagens, facilita trocar idioma por projeto sem tocar lógica.

### 6. Limpeza pontual
- Pasta com nome quebrado `src/types/]` — remover.
- Decidir explicitamente os papéis de `ui/` vs `ds/` vs `reui/` (ver item 1) e documentar.

## Descoberta: registry privado do shadcn como mecanismo de reuso entre projetos

Pesquisado no mercado (não é invenção interna — é feature oficial do shadcn CLI 3.0+):

- Um registry (`registry.json` + itens, pode viver até direto num repo GitHub, sem
  servidor) pode ser consumido por **qualquer número de projetos/repos não relacionados**
  — cada um só adiciona a URL como namespace no próprio `components.json`
  (`@corpus/nome-do-componente`).
- Isso resolve o problema atual de **duplicar componente em vários projetos e cada um
  ficar numa versão diferente**: em vez de copiar e colar manualmente, cada projeto
  cliente instala/atualiza a partir de uma única fonte.
- **Não é sync automático** tipo npm/Dependabot. É pull sob demanda:
  - `npx shadcn add @corpus/x` — (re)instala a versão atual.
  - `npx shadcn diff @corpus/x` — mostra o que mudou no registry vs. o arquivo já
    instalado localmente.
  - Rodar `add` de novo **sobrescreve o arquivo**. Sem merge automático de 3 vias — se
    o arquivo foi editado à mão, precisa reconciliar manualmente.
- Consequência direta: a disciplina do item 1 (nunca editar `ui/`/`reui`/itens do
  registry à mão; customização sempre em `ds/` por cima) é o que torna esse fluxo de
  atualização seguro e sem conflito em todos os projetos ao mesmo tempo.
- Suporta autenticação (headers/env vars) para registries privados, não só públicos.
- Ideia levantada para explorar depois: publicar um registry interno com os
  componentes de `ds/` (e talvez uma curadoria de `ui/`/`reui`) e, no limite, os próprios
  módulos de negócio genéricos (Lojas, Cargos, etc.) como itens instaláveis — complemento
  ou até alternativa parcial ao clone completo do repo-template para montar um projeto
  novo.
- **Nome do namespace: `@kso`** (pessoal, não `@corpus`). Decisão: como o registry deve
  ser reutilizável entre projetos/clientes diferentes, o nome não pode remeter a um
  cliente específico (Corpus) nem, por ora, a uma empresa (o registry é mantido
  pessoalmente hoje). Se no futuro isso migrar para pertencer a uma empresa, o namespace
  pode precisar ser revisitado.

## Ordem sugerida de execução (ainda em aberto, sujeita a discussão)

1. Limpeza (`src/types/]`) + documentar regra de camadas do UI (`ui`/`ds`/`reui`).
2. Renomear tokens base de `brand.css` para algo neutro (pré-requisito para white-label).
3. Centralizar branding build-time em `.env` + `brand.config.ts`.
4. Extrair `lojas`/offline do `use-crud` core para opt-in.
5. Criar o registry único de módulos e migrar sidebar/permissões para ler dele. **Feito**
   (`src/modules/registry.ts`).
6. Prototipar um registry shadcn privado `@kso`. **Feito (piloto) — ver `docs/registry.md`**:
   `registry.json` + pipeline em `scripts/registry/` cobrindo o kernel base (`@kso/base`)
   e 6 dos 13 módulos de `(cadastros)` (lojas, depositos, tabelas-precos, itens,
   grupos-itens, unidade-medida), com granularidade por módulo individual, pelo grupo
   inteiro (`@kso/cadastros`) e por componente avulso (`@kso/image-upload`). Falta migrar
   os outros 7 módulos de cadastro e publicar o registry num domínio real.

## Perguntas em aberto

- ~~O registry privado deve hospedar só componentes de UI, ou também tentaremos empacotar
  módulos de negócio inteiros (CRUD completo) como itens de registry?~~ Respondida pelo
  piloto: também empacota módulo de negócio inteiro (`registry:block` por módulo de
  cadastro), com o kernel compartilhado isolado num item `@kso/base` à parte. Ver
  `docs/registry.md` para os detalhes e limitações descobertas (ex: `itens` acopla a
  5 outros módulos por causa de tipos, `unidade-medida` depende de `lojas`).
- Como versionar o `brand.config.ts`/tokens por cliente quando o mesmo cliente tiver
  múltiplas lojas com branding próprio (runtime) *e* um branding de base (build-time)?
- Vale a pena automatizar o `shadcn diff` em CI para avisar quando um projeto cliente
  está desatualizado em relação ao registry interno?
- Onde publicar o `registry.json` de fato (domínio próprio, GitHub Pages, ou dentro do
  próprio app em `/r/*.json` já que é Next.js)? Hoje `homepage` em `registry.json` é um
  placeholder.
