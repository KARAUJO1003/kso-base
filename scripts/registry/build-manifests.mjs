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

// base-union.json: união de base/stockUi/vendoredExternal/npmPackages entre todos os módulos.
const baseSet = new Set(), stockUiSet = new Set(), vendoredSet = new Set(), npmSet = new Set();
for (const d of Object.values(classifiedByModule)) {
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
