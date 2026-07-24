# Registry de componentes próprios (`@kso`)

Piloto de um registry shadcn privado para reuso de código entre projetos que
descendem deste template. Contexto e decisão original em
`docs/plugin-play-strategy.md` (seção "Descoberta: registry privado do shadcn").

## O que resolve

Instalação seletiva, em outro projeto (ou noutro cliente), de:

1. **Um módulo de cadastro isolado** — `npx shadcn add @kso/lojas`.
2. **Um grupo inteiro** — `npx shadcn add @kso/cadastros` (instala todos os módulos
   já publicados, resolvendo a árvore de dependências sozinho).
3. **Um componente avulso**, sem trazer nada além do que ele realmente usa —
   `npx shadcn add @kso/image-upload`.

Isso é uma feature nativa do shadcn CLI (3.0+): itens de registry declaram
`registryDependencies` uns dos outros, e o CLI resolve a árvore recursivamente.
Não é sync automático (tipo Dependabot) — é pull sob demanda; rodar `add` de novo
sobrescreve o arquivo local (sem merge de 3 vias).

## Estrutura dos itens

- **`@kso/base`** (`registry:lib`) — o kernel compartilhado: hooks (`use-crud`,
  `use-modal-instance`), contexts/providers (store, modal, auth), a camada de
  permissões e feature flags, `DataTable`, `FormFields` e os componentes de
  `components/ui/` que **não** são primitivas shadcn de prateleira (`combobox*`,
  `multi-select`, `native-select`, `image-upload` — ver "Achado" abaixo). Todo
  módulo de negócio depende dele.
- **Um item por módulo de cadastro** (`registry:block`) — só os arquivos daquele
  módulo (`feature.tsx`, `components/`, `utils/`, a rota em `src/app/`, os tipos em
  `src/types/<slug>/`), mais `registryDependencies` para `@kso/base` e para os
  outros módulos de cadastro que ele referencia de verdade (ver grafo abaixo).
- **`@kso/cadastros`** (`registry:block`) — item "guarda-chuva", sem arquivos
  próprios: só lista os módulos já publicados em `registryDependencies`.
- **`@kso/image-upload`** (`registry:ui`) — exemplo de componente 100% standalone
  (não depende do kernel base, só de `src/lib/utils.ts`) — prova de que dá pra
  instalar "só esse componente especial" em qualquer projeto, nem precisa ser
  descendente do kso-base.

## Módulos já publicados (piloto — 6 de 13)

`lojas`, `depositos`, `tabelas-precos`, `itens`, `grupos-itens`, `unidade-medida`.

Grafo de dependência direta entre eles (descoberto automaticamente, não é
suposição — ver "Como foi descoberto" abaixo):

```
lojas          -> depositos, tabelas-precos
depositos      -> (nenhuma)
tabelas-precos -> itens
itens          -> depositos, grupos-itens, lojas, tabelas-precos, unidade-medida
grupos-itens   -> (nenhuma)
unidade-medida -> lojas
```

`itens` é o mais acoplado: um item de estoque referencia tipos de loja, depósito,
tabela de preço, grupo e unidade de medida. Instalar `@kso/itens` sozinho traz,
por dependência transitiva, os outros 5 módulos — isso é esperado, não um bug do
registry, é o acoplamento real do domínio.

**Faltam migrar:** `grupos-lojas`, `setores`, `gerencia`, `cargos`, `colaboradores`,
`pessoas`, `fornecedores`, `centros-custos`, `formas-pagamentos`, `motivos-trocas`.
O processo é mecânico (ver abaixo) — não foram feitos só por escopo do piloto.

## Achado importante: `components/ui/` não é 100% vendorizado

A convenção documentada em `plugin-play-strategy.md` diz que `components/ui/*` é
"saída crua do `shadcn add`/registries, nunca editar à mão". Na prática, o projeto
tem componentes próprios morando ali: `combobox.tsx`, `combobox-async.tsx`,
`combobox-select.tsx`, `image-upload.tsx`, `multi-select.tsx`, `native-select.tsx`
— não existem no shadcn/ui oficial. O gerador trata isso automaticamente: qualquer
arquivo em `components/ui/` cujo nome não esteja na lista de primitivas oficiais
(`STOCK_SHADCN_NAMES` em `scripts/registry/classify.mjs`) é embarcado como arquivo
real no `@kso/base`, em vez de virar uma `registryDependency` por nome (que
assumiria que o CLI consegue baixar do registry público do shadcn).

Vale decidir, em algum momento, se esses componentes devem migrar para `components/ds/`
(que já é o lugar formalmente destinado a customização própria) — hoje o registry só
contorna a inconsistência, não a resolve.

## Como foi descoberto (e como reproduzir para os outros 7 módulos)

Mapear à mão os imports de ~65 arquivos de kernel compartilhado por módulo seria
lento e arriscado (achamos incoerências reais assim, como `unidade-medida`
depender de `lojas`, que não estava documentado em lugar nenhum). Em vez disso,
`scripts/registry/` traça o grafo de imports de verdade:

1. **`trace-imports.mjs`** — BFS sobre `import`/`require` a partir de um arquivo de
   entrada (`feature.tsx` + `page.tsx` do módulo), resolvendo alias `@/` → `src/` e
   imports relativos, até fechar todos os arquivos internos tocados + o conjunto de
   pacotes npm usados.
2. **`classify.mjs`** — separa esses arquivos em: próprios do módulo, de outro
   módulo de cadastro (cross-module), primitiva shadcn de prateleira, vendorizado
   de `@reui`, ou kernel base. Tem um mapa de aliases pra nomes de pasta
   inconsistentes no repo (ex: `types/deposito` singular vs.
   `features/(cadastros)/depositos` plural; `unidade-medida` vs. rota
   `unidades-medidas`).
3. **`direct-cross-refs.mjs`** — re-examina só os imports DIRETOS dos arquivos
   "próprios" do módulo (não a clausura transitiva), pra saber exatamente quais
   outros módulos ele referencia — o CLI já resolve dependência-de-dependência
   sozinho, então declarar de mais deixaria o grafo ilegível sem ganhar nada.
4. **`build-manifests.mjs`** — roda os três acima para a lista `MODULES` e grava
   tudo em `scripts/registry/manifests/`.
5. **`generate-registry-json.mjs`** — lê os manifests e escreve `registry.json` na
   raiz do repo.

Para publicar os módulos que faltam:

```bash
# 1. edite scripts/registry/build-manifests.mjs:
#    - adicione o slug em MODULES
#    - se a pasta de rota em src/app/(root)/(cadastros)/ tiver nome diferente do
#      slug da feature, adicione o alias em ROUTE_SLUG_ALIASES
# 2. edite scripts/registry/generate-registry-json.mjs:
#    - adicione { title, description } do módulo em PILOT_MODULES

npm run registry:build   # roda manifests -> registry.json -> shadcn build
```

`npm run registry:build` já validou o piloto de ponta a ponta (`shadcn build`
consumiu o `registry.json` gerado e produziu `public/r/*.json` sem erro).

## Publicar de fato

`public/r/*.json` é o output do build — fica fora do git (`.gitignore`) e é
regenerado por `npm run registry:build`. Como este projeto já é um app Next.js,
`public/` é servido estaticamente: depois de um deploy, os itens ficam disponíveis
em `https://<domínio-publicado>/r/<nome>.json`. **Falta decidir o domínio real** —
`registry.json` tem um `homepage` placeholder até lá.

Um projeto cliente consumidor precisa, no próprio `components.json`:

```json
{
  "registries": {
    "@kso": "https://<domínio-publicado>/r/{name}.json"
  }
}
```

E, como os módulos usam componentes de `@reui` (`autocomplete`, `number-field`),
precisa também ter esse registry configurado (igual ao deste repo) — senão a
instalação de um módulo de cadastro falha ao tentar baixar esses dois itens.

## Limitações conhecidas do piloto

- Só 6 dos 13 módulos de `(cadastros)` estão publicados.
- `@kso/base` tem 59 arquivos e puxa ~24 pacotes npm — é pesado por natureza,
  porque o kernel deste app é genuinamente acoplado (auth, offline sync, feature
  flags, branding por loja tudo junto). Não dá pra fatiar mais fino sem separar
  essas responsabilidades no código-fonte primeiro.
- Não cobre módulos fora de `(cadastros)` (ex: `users`, `roles`, `permissions`).
- Sem CI publicando o registry automaticamente a cada push — hoje é
  `npm run registry:build` manual.
