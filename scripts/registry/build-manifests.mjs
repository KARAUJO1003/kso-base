#!/usr/bin/env node
// Orquestra o pipeline de descoberta de dependências para a lista de módulos
// de cadastro abaixo: trace-imports -> classify -> direct-cross-refs, e
// grava os manifests em scripts/registry/manifests/ (consumidos por
// generate-registry-json.mjs). Rode de novo sempre que mexer em algum
// módulo de (cadastros) ou no kernel compartilhado, antes de gerar o
// registry.json.
//
// Para adicionar um módulo novo: inclua o slug (nome da pasta em
// src/features/(cadastros)/) na lista MODULES abaixo. Se a pasta de rota em
// src/app/(root)/(cadastros)/ tiver um nome diferente do slug, adicione o
// alias em ROUTE_SLUG_ALIASES.
//
// Uso: node scripts/registry/build-manifests.mjs

import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..", "..");
const MANIFEST_DIR = join(ROOT, "scripts", "registry", "manifests");
const SCRIPTS_DIR = join(ROOT, "scripts", "registry");

const MODULES = [
  "lojas",
  "depositos",
  "tabelas-precos",
  "itens",
  "grupos-itens",
  "unidade-medida",
];

const ROUTE_SLUG_ALIASES = {
  "unidade-medida": "unidades-medidas",
};

// Layout raiz + layout de (root): não pertencem a nenhum módulo (nada em
// (cadastros) os importa — são "donos" das páginas via convenção de pastas
// do Next.js, não import direto), então o trace por módulo nunca os
// alcança sozinho. Sem eles, @kso/base te dá os hooks/contexts mas não a
// montagem de providers (QueryClientProvider, ModalProvider, StoreProvider,
// AuthProvider...) — instalar um módulo funciona, mas quebra em runtime com
// "No QueryClient set" até alguém descobrir e montar isso manualmente. Ver
// content/docs/registry.mdx.
const SHELL_ENTRIES = ["src/app/layout.tsx", "src/app/(root)/layout.tsx"];

function run(script, args, input) {
  return execFileSync("node", [join(SCRIPTS_DIR, script), ...args], {
    cwd: ROOT,
    input,
    maxBuffer: 32 * 1024 * 1024,
  }).toString();
}

const classifiedByModule = {};

for (const slug of MODULES) {
  const routeSlug = ROUTE_SLUG_ALIASES[slug] || slug;
  const featureEntry = `src/features/(cadastros)/${slug}/feature.tsx`;
  const pageEntry = `src/app/(root)/(cadastros)/${routeSlug}/page.tsx`;

  if (!existsSync(join(ROOT, featureEntry))) {
    console.error(`[skip] ${slug}: ${featureEntry} não existe`);
    continue;
  }
  if (!existsSync(join(ROOT, pageEntry))) {
    console.error(`[skip] ${slug}: ${pageEntry} não existe (confira ROUTE_SLUG_ALIASES)`);
    continue;
  }

  const traceOut = run("trace-imports.mjs", [featureEntry, pageEntry]);
  writeFileSync(join(MANIFEST_DIR, `trace-${slug}.json`), traceOut);

  const classifyOut = run("classify.mjs", [slug], traceOut);
  writeFileSync(join(MANIFEST_DIR, `classified-${slug}.json`), classifyOut);
  classifiedByModule[slug] = JSON.parse(classifyOut);

  console.log(`[ok] ${slug}: own=${classifiedByModule[slug].own.length} base=${classifiedByModule[slug].base.length}`);
}

// Trace do "shell" do app (layouts raiz), sem dono de módulo — tudo cai em
// base/stockUi/vendoredExternal via classify.mjs com um slug que não bate
// com nenhuma feature de verdade.
const shellTraceOut = run("trace-imports.mjs", SHELL_ENTRIES);
writeFileSync(join(MANIFEST_DIR, "trace-app-shell.json"), shellTraceOut);
const shellClassifyOut = run("classify.mjs", ["app-shell"], shellTraceOut);
writeFileSync(join(MANIFEST_DIR, "classified-app-shell.json"), shellClassifyOut);
const shellClassified = JSON.parse(shellClassifyOut);
// NÃO embarca os layout.tsx em si: quase todo projeto de destino já tem um
// (é obrigatório pro App Router funcionar), então o shadcn CLI pula por
// já existir (comportamento padrão, não sobrescreve) — embarcar serviria de
// pouco e arrisca sobrescrever por engano num projeto sem layout ainda.
// A montagem (RootProviders/ProtectedProviders) precisa ser feita à mão no
// layout de quem instala — ver content/docs/registry.mdx.
shellClassified.base = shellClassified.base.filter((f) => !SHELL_ENTRIES.includes(f));
console.log(`[ok] app-shell: base=${shellClassified.base.length}`);

// base-union.json: união de base/stockUi/vendoredExternal/npmPackages entre todos os módulos + o shell.
const baseSet = new Set(), stockUiSet = new Set(), vendoredSet = new Set(), npmSet = new Set();
for (const d of [...Object.values(classifiedByModule), shellClassified]) {
  d.base.forEach((f) => baseSet.add(f));
  d.stockUi.forEach((f) => stockUiSet.add(f));
  d.vendoredExternal.forEach((f) => vendoredSet.add(f));
  d.npmPackages.forEach((f) => npmSet.add(f));
}
writeFileSync(
  join(MANIFEST_DIR, "base-union.json"),
  JSON.stringify(
    {
      base: [...baseSet].sort(),
      stockUi: [...stockUiSet].sort(),
      vendoredExternal: [...vendoredSet].sort(),
      npmPackages: [...npmSet].sort(),
    },
    null,
    2,
  ) + "\n",
);

// cross-refs.json: dependências DIRETAS (não-transitivas) de cada módulo sobre outros módulos.
const crossRefs = {};
for (const slug of Object.keys(classifiedByModule)) {
  const ownFiles = classifiedByModule[slug].own;
  const result = run("direct-cross-refs.mjs", [slug, ...ownFiles]);
  crossRefs[slug] = JSON.parse(result);
}
writeFileSync(join(MANIFEST_DIR, "cross-refs.json"), JSON.stringify(crossRefs, null, 2) + "\n");

console.log(`\nManifests gravados em ${MANIFEST_DIR.replace(ROOT + "/", "")}/`);
