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
import { resolve, dirname, join, extname } from "node:path";

const ROOT = resolve(import.meta.dirname, "..", "..");
const SRC = join(ROOT, "src");
const IMPORT_RE = /(?:import|export)\s+(?:type\s+)?(?:[\s\S]*?)\s+from\s+["']([^"']+)["']|import\s*\(\s*["']([^"']+)["']\s*\)|require\(\s*["']([^"']+)["']\s*\)/g;
const CANDIDATE_EXT = [".ts", ".tsx", ".js", ".jsx"];

const TYPE_DIR_TO_MODULE_SLUG = { deposito: "depositos", items: "itens" };

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
    const relResolved = resolved.replace(ROOT + "/", "");

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
