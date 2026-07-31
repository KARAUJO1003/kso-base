#!/usr/bin/env node
// Classifica a lista de arquivos (saída do trace-imports.mjs) em baldes:
// - own: pertence ao próprio módulo (features/(cadastros)/<module>/*, app page, types/<module>/*)
// - crossModule: pertence a OUTRO módulo de cadastro (vira registryDependency de módulo)
// - stockUi: components/ui/<nome> que é primitiva shadcn "de prateleira" (não embarca arquivo,
//   vira registryDependency pelo nome — o CLI resolve contra o registry público)
// - vendoredExternal: components/reui/<nome> (vem do registry @reui já configurado em components.json)
// - base: tudo mais (hooks, lib, contexts, providers, config, components/layout,
//   components/extensions, components/shared, components/ui customizado, types compartilhados)
//
// Uso: node scripts/registry/classify.mjs <module-slug> < trace.json

import { readFileSync } from "node:fs";

// Lista de nomes de componentes shadcn/ui "de prateleira" — instaláveis pelo CLI
// a partir do registry público oficial, sem precisar embarcar o arquivo.
// (mantida manualmente; ver STOCK_SHADCN_NAMES em docs/registry.md)
const STOCK_SHADCN_NAMES = new Set([
  "accordion", "alert", "alert-dialog", "aspect-ratio", "avatar", "badge",
  "breadcrumb", "button", "button-group", "calendar", "card", "carousel",
  "chart", "checkbox", "collapsible", "command", "context-menu", "dialog",
  "drawer", "dropdown-menu", "empty", "field", "form", "hover-card",
  "input", "input-group", "input-otp", "item", "kbd", "label", "menubar",
  "navigation-menu", "pagination", "popover", "progress", "radio-group",
  "resizable", "scroll-area", "select", "separator", "sheet", "sidebar",
  "skeleton", "slider", "sonner", "spinner", "switch", "table", "tabs",
  "textarea", "toggle", "toggle-group", "tooltip",
]);

// O repo não usa nomenclatura consistente entre a pasta da feature (plural,
// em português) e a pasta de tipos correspondente. Mapeia manualmente os
// casos que não são resolvidos por uma simples adição/remoção de "s".
// Slugs de módulo canônicos vêm de src/modules/registry.ts.
const TYPE_DIR_TO_MODULE_SLUG = {
  deposito: "depositos",
  items: "itens",
  gerencia: "gerencias",
};

// idem, mas para a pasta de rota em src/app/(root)/(cadastros)/<rota>/ —
// nem sempre bate com o slug da feature (ex: unidade-medida -> unidades-medidas).
const MODULE_SLUG_TO_ROUTE_SLUG = {
  "unidade-medida": "unidades-medidas",
};

// Módulos cuja rota não vive sob (root)/(cadastros)/<slug>/ (ex: setores fica
// direto em (root)/setores/). Mesma lista que ROUTE_BASE_OVERRIDES em
// build-manifests.mjs — mantidas separadas porque os scripts rodam como
// processos independentes.
const MODULE_ROUTE_BASE_OVERRIDES = {
  setores: "src/app/(root)/setores",
};

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Grupo (seguranca)/users: estrutura diferente de (cadastros) — os módulos
// "roles"/"permissions"/"systems"/"modules" são SUBPASTAS de "users" (não
// irmãs dele), e os arquivos de interfaces/schemas de cada um moram soltos
// na pasta do pai (users/interfaces/<slug>.d.ts, users/schemas/<slug>.ts),
// não numa subpasta própria. O regex genérico de (cadastros) não dá conta
// disso, então este é o mapa de ownership explícito complementar (ver
// docs/registry.md).
const SEGURANCA_ROOT = "src/features/(seguranca)/users/";
const SEGURANCA_PAGE_ROOT = "src/app/(root)/users/(pages)/";
const SEGURANCA_NESTED_SLUGS = new Set(["roles", "permissions", "systems", "modules"]);
const SEGURANCA_FILE_OWNERS = {
  "src/features/(seguranca)/users/interfaces/roles.d.ts": "roles",
  "src/features/(seguranca)/users/interfaces/permissions.d.ts": "permissions",
  "src/features/(seguranca)/users/interfaces/modules.d.ts": "modules",
  "src/features/(seguranca)/users/schemas/roles.ts": "roles",
  "src/features/(seguranca)/users/schemas/permissions.ts": "permissions",
  "src/features/(seguranca)/users/schemas/modules.ts": "modules",
  "src/features/(seguranca)/users/schemas/systems.ts": "systems",
};

// Retorna o slug do módulo dono de `file`, ou null se `file` não pertence a
// este grupo (nesse caso cai nas outras checagens de classify.mjs abaixo).
function segurancaOwner(file) {
  if (file.startsWith(SEGURANCA_ROOT)) {
    const rest = file.slice(SEGURANCA_ROOT.length);
    const nested = rest.match(/^([^/]+)\//);
    if (nested && SEGURANCA_NESTED_SLUGS.has(nested[1])) return nested[1];
    if (SEGURANCA_FILE_OWNERS[file]) return SEGURANCA_FILE_OWNERS[file];
    return "users"; // arquivo solto na pasta do pai, sem override -> é do users
  }
  if (file.startsWith(SEGURANCA_PAGE_ROOT)) {
    const rest = file.slice(SEGURANCA_PAGE_ROOT.length);
    if (rest === "page.tsx" || rest === "layout.tsx") return "users";
    const nested = rest.match(/^([^/]+)\/page\.tsx$/);
    if (nested && SEGURANCA_NESTED_SLUGS.has(nested[1])) return nested[1];
  }
  return null;
}

const [moduleSlug] = process.argv.slice(2);
if (!moduleSlug) {
  console.error("Uso: node scripts/registry/classify.mjs <module-slug> < trace.json");
  process.exit(1);
}

const input = JSON.parse(readFileSync(0, "utf8"));

const own = [];
const crossModule = new Map(); // otherModuleSlug -> files[]
const stockUi = new Set();
const vendoredExternal = new Set();
const base = [];

const cadastroModuleRe = /^src\/features\/\(cadastros\)\/([^/]+)\//;
const uiRe = /^src\/components\/ui\/([^/]+)\.tsx?$/;
const reuiRe = /^src\/components\/reui\/([^/]+)\.tsx?$/;
const routeSlug = MODULE_SLUG_TO_ROUTE_SLUG[moduleSlug] || moduleSlug;
const routeBase =
  MODULE_ROUTE_BASE_OVERRIDES[moduleSlug] || `src/app/(root)/(cadastros)/${routeSlug}`;
const ownPageRe = new RegExp(`^${escapeRegExp(routeBase)}/`);

function resolveModuleSlugForTypesDir(typeSlug) {
  if (TYPE_DIR_TO_MODULE_SLUG[typeSlug]) return TYPE_DIR_TO_MODULE_SLUG[typeSlug];
  return typeSlug;
}

for (const file of input.files) {
  const segOwner = segurancaOwner(file);
  if (segOwner) {
    if (segOwner === moduleSlug) own.push(file);
    else {
      if (!crossModule.has(segOwner)) crossModule.set(segOwner, []);
      crossModule.get(segOwner).push(file);
    }
    continue;
  }

  const cadastroMatch = file.match(cadastroModuleRe);
  if (cadastroMatch) {
    const otherSlug = cadastroMatch[1];
    if (otherSlug === moduleSlug) own.push(file);
    else {
      if (!crossModule.has(otherSlug)) crossModule.set(otherSlug, []);
      crossModule.get(otherSlug).push(file);
    }
    continue;
  }

  if (ownPageRe.test(file)) {
    own.push(file);
    continue;
  }

  const typesMatch = file.match(/^src\/types\/([^/]+)\//);
  if (typesMatch) {
    const resolvedSlug = resolveModuleSlugForTypesDir(typesMatch[1]);
    if (resolvedSlug === moduleSlug) {
      own.push(file);
    } else {
      if (!crossModule.has(resolvedSlug)) crossModule.set(resolvedSlug, []);
      crossModule.get(resolvedSlug).push(file);
    }
    continue;
  }

  const uiMatch = file.match(uiRe);
  if (uiMatch) {
    if (STOCK_SHADCN_NAMES.has(uiMatch[1])) stockUi.add(uiMatch[1]);
    else base.push(file); // ui/ customizado -> vai pro kernel base
    continue;
  }

  const reuiMatch = file.match(reuiRe);
  if (reuiMatch) {
    vendoredExternal.add(reuiMatch[1]);
    continue;
  }

  base.push(file);
}

console.log(JSON.stringify({
  module: moduleSlug,
  own: own.sort(),
  crossModule: Object.fromEntries([...crossModule.entries()].map(([k, v]) => [k, v.sort()])),
  stockUi: [...stockUi].sort(),
  vendoredExternal: [...vendoredExternal].sort(),
  base: base.sort(),
  npmPackages: input.npmPackages,
}, null, 2));
