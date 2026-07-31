#!/usr/bin/env node
// Diferente do trace-imports (que segue toda a cadeia transitiva), este script
// olha só os imports DIRETOS dos arquivos "own" de um módulo, pra saber quais
// outros módulos de cadastro ele referencia de verdade (sem herdar, por
// transitividade, as dependências dos módulos que ele já depende).
// Isso é o que deve virar registryDependencies — o shadcn CLI já resolve
// dependência-de-dependência sozinho.
//
// Uso: node scripts/registry/direct-cross-refs.mjs <module-slug> <ownFile1> [ownFile2 ...]

import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname, join, extname, relative, sep } from "node:path";

const ROOT = resolve(import.meta.dirname, "..", "..");
const SRC = join(ROOT, "src");

// Ver comentário equivalente em trace-imports.mjs: no Windows, resolve()/join()
// devolvem "\" e as regexes abaixo esperam caminho relativo estilo POSIX.
function toRelPosix(absPath) {
  return relative(ROOT, absPath).split(sep).join("/");
}
const IMPORT_RE = /(?:import|export)\s+(?:type\s+)?(?:[\s\S]*?)\s+from\s+["']([^"']+)["']|import\s*\(\s*["']([^"']+)["']\s*\)|require\(\s*["']([^"']+)["']\s*\)/g;
// Ver comentário em trace-imports.mjs — ".d.ts" precisa entrar pra resolver
// os arquivos de interface do grupo (seguranca)/users (roles.d.ts etc).
const CANDIDATE_EXT = [".d.ts", ".ts", ".tsx", ".js", ".jsx"];

const TYPE_DIR_TO_MODULE_SLUG = { deposito: "depositos", items: "itens", gerencia: "gerencias" };

// Ver comentário completo em classify.mjs — mesmo mapa de ownership pro
// grupo (seguranca)/users, mantido duplicado de propósito (scripts
// independentes, mesmo padrão já usado por TYPE_DIR_TO_MODULE_SLUG acima).
const SEGURANCA_ROOT = "src/features/(seguranca)/users/";
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

function segurancaOwner(file) {
  if (!file.startsWith(SEGURANCA_ROOT)) return null;
  const rest = file.slice(SEGURANCA_ROOT.length);
  const nested = rest.match(/^([^/]+)\//);
  if (nested && SEGURANCA_NESTED_SLUGS.has(nested[1])) return nested[1];
  if (SEGURANCA_FILE_OWNERS[file]) return SEGURANCA_FILE_OWNERS[file];
  return "users";
}

function resolveSpecifier(specifier, fromFile) {
  let base;
  if (specifier.startsWith("@/")) base = join(SRC, specifier.slice(2));
  else if (specifier.startsWith(".")) base = join(dirname(fromFile), specifier);
  else return null;

  if (existsSync(base) && !extname(base)) {
    for (const ext of CANDIDATE_EXT) if (existsSync(base + ext)) return base + ext;
    for (const ext of CANDIDATE_EXT) { const idx = join(base, "index" + ext); if (existsSync(idx)) return idx; }
    return null;
  }
  if (existsSync(base)) return base;
  for (const ext of CANDIDATE_EXT) if (existsSync(base + ext)) return base + ext;
  return null;
}

const [moduleSlug, ...ownFiles] = process.argv.slice(2);
const crossModules = new Set();

for (const relFile of ownFiles) {
  const file = resolve(ROOT, relFile);
  if (!existsSync(file)) continue;
  const content = readFileSync(file, "utf8");
  let match;
  IMPORT_RE.lastIndex = 0;
  while ((match = IMPORT_RE.exec(content))) {
    const specifier = match[1] || match[2] || match[3];
    if (!specifier) continue;
    const resolved = resolveSpecifier(specifier, file);
    if (!resolved) continue;
    const relResolved = toRelPosix(resolved);

    const segOwner = segurancaOwner(relResolved);
    if (segOwner) {
      if (segOwner !== moduleSlug) crossModules.add(segOwner);
      continue;
    }

    const featureMatch = relResolved.match(/^src\/features\/\(cadastros\)\/([^/]+)\//);
    if (featureMatch && featureMatch[1] !== moduleSlug) {
      crossModules.add(featureMatch[1]);
      continue;
    }
    const typesMatch = relResolved.match(/^src\/types\/([^/]+)\//);
    if (typesMatch) {
      const slug = TYPE_DIR_TO_MODULE_SLUG[typesMatch[1]] || typesMatch[1];
      if (slug !== moduleSlug) crossModules.add(slug);
    }
  }
}

console.log(JSON.stringify([...crossModules].sort()));
