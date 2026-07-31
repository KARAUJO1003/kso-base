#!/usr/bin/env node
// Orquestra o pipeline de descoberta de dependências para a lista de módulos
// de cadastro abaixo: trace-imports -> classify -> direct-cross-refs, e
// grava os manifests em scripts/registry/manifests/ (consumidos por
// generate-registry-json.mjs). Rode de novo sempre que mexer em algum
// módulo de (cadastros) ou no kernel compartilhado, antes de gerar o
// registry.json.
//
// Para adicionar um módulo de (cadastros) novo: inclua o slug (nome da pasta
// em src/features/(cadastros)/) na lista MODULES abaixo. Se a pasta de rota
// em src/app/(root)/(cadastros)/ tiver um nome diferente do slug, adicione o
// alias em ROUTE_SLUG_ALIASES (ou ROUTE_BASE_OVERRIDES se a rota nem vive
// sob (cadastros)/, caso do setores). Módulos fora de (cadastros) — hoje só
// o grupo (seguranca)/users — entram em SEGURANCA_MODULES, com os próprios
// entry points (estrutura de pastas diferente, ver classify.mjs).
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
  "cargos",
  "centros-custos",
  "colaboradores",
  "formas-pagamentos",
  "fornecedores",
  "gerencias",
  "grupos-lojas",
  "motivos-trocas",
  "pessoas",
  "setores",
  "sub-grupos-itens",
];

const ROUTE_SLUG_ALIASES = {
  "unidade-medida": "unidades-medidas",
};

// Módulos cuja rota não vive sob (root)/(cadastros)/<slug>/ como os demais
// (inconsistência real do repo, não erro deste script — ver classify.mjs
// MODULE_ROUTE_BASE_OVERRIDES, que precisa do mesmo override).
const ROUTE_BASE_OVERRIDES = {
  setores: "src/app/(root)/setores/page.tsx",
};

// Grupo (seguranca)/users: "roles"/"permissions"/"systems"/"modules" são
// subpastas de "users", não módulos irmãos — precisam dos próprios entry
// points em vez do template `(cadastros)/<slug>/...`. "users" também inclui
// o layout.tsx (nunca é importado por ninguém, é convenção de rota do
// Next.js, então precisa entrar como entry point explícito pra ser traçado).
const SEGURANCA_MODULES = [
  {
    slug: "users",
    entries: [
      "src/features/(seguranca)/users/feature.tsx",
      "src/app/(root)/users/(pages)/page.tsx",
      "src/app/(root)/users/(pages)/layout.tsx",
    ],
  },
  {
    slug: "roles",
    entries: [
      "src/features/(seguranca)/users/roles/feature.tsx",
      "src/app/(root)/users/(pages)/roles/page.tsx",
    ],
  },
  {
    slug: "permissions",
    entries: [
      "src/features/(seguranca)/users/permissions/feature.tsx",
      "src/app/(root)/users/(pages)/permissions/page.tsx",
    ],
  },
  {
    slug: "systems",
    entries: [
      "src/features/(seguranca)/users/systems/feature.tsx",
      "src/app/(root)/users/(pages)/systems/page.tsx",
    ],
  },
  {
    slug: "modules",
    entries: [
      "src/features/(seguranca)/users/modules/feature.tsx",
      "src/app/(root)/users/(pages)/modules/page.tsx",
    ],
  },
];

function run(script, args, input) {
  return execFileSync("node", [join(SCRIPTS_DIR, script), ...args], {
    cwd: ROOT,
    input,
    maxBuffer: 32 * 1024 * 1024,
  }).toString();
}

const classifiedByModule = {};

function processModule(slug, entries) {
  const missing = entries.filter((entry) => !existsSync(join(ROOT, entry)));
  if (missing.length) {
    console.error(`[skip] ${slug}: ${missing.join(", ")} não existe`);
    return;
  }

  const traceOut = run("trace-imports.mjs", entries);
  writeFileSync(join(MANIFEST_DIR, `trace-${slug}.json`), traceOut);

  const classifyOut = run("classify.mjs", [slug], traceOut);
  writeFileSync(join(MANIFEST_DIR, `classified-${slug}.json`), classifyOut);
  classifiedByModule[slug] = JSON.parse(classifyOut);

  console.log(`[ok] ${slug}: own=${classifiedByModule[slug].own.length} base=${classifiedByModule[slug].base.length}`);
}

for (const slug of MODULES) {
  const routeSlug = ROUTE_SLUG_ALIASES[slug] || slug;
  const featureEntry = `src/features/(cadastros)/${slug}/feature.tsx`;
  const pageEntry = ROUTE_BASE_OVERRIDES[slug] || `src/app/(root)/(cadastros)/${routeSlug}/page.tsx`;
  processModule(slug, [featureEntry, pageEntry]);
}

for (const { slug, entries } of SEGURANCA_MODULES) {
  processModule(slug, entries);
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
