#!/usr/bin/env node
// Traça o grafo de imports internos a partir de um ou mais arquivos de entrada,
// pra descobrir automaticamente quais arquivos, primitivas @/components/ui/* e
// pacotes npm um módulo (feature) realmente usa em runtime.
//
// Uso: node scripts/registry/trace-imports.mjs <arquivo1> [arquivo2 ...]
// Saída: JSON em stdout { files, npmPackages, unresolved }

import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname, join, extname, relative, sep } from "node:path";

const ROOT = resolve(import.meta.dirname, "..", "..");

// Carrega TODOS os path aliases do tsconfig.json (não só "@/*"). O projeto
// também define "@features/*", "@components/*", "@lib/*", "@types/*" etc.
// Antes só "@/*" era reconhecido como alias interno, então specifiers como
// "@features/(cadastros)/gerencias/..." caíam no branch "npm" por engano e
// viravam uma "dependência npm" fantasma (@features/(cadastros)) no registry.
const tsconfig = JSON.parse(readFileSync(join(ROOT, "tsconfig.json"), "utf8"));
const rawPaths = tsconfig.compilerOptions?.paths || {};
const ALIASES = Object.entries(rawPaths)
  .map(([key, targets]) => ({
    prefix: key.replace(/\*$/, ""),
    target: targets[0].replace(/^\.\//, "").replace(/\*$/, ""),
  }))
  // Prefixos mais específicos primeiro (ex.: "@/root/*" antes de "@/*"),
  // senão "@/*" sempre vence e "@/root/..." nunca resolve pro alvo certo.
  .sort((a, b) => b.prefix.length - a.prefix.length);

// Windows resolve()/join() devolvem caminho com "\", mas todo o resto do
// pipeline (classify.mjs, direct-cross-refs.mjs, regexes abaixo) espera
// caminho relativo estilo POSIX ("src/features/..."). Sem isso, no Windows
// nenhuma regex bate e tudo cai em "base" por engano.
function toRelPosix(absPath) {
  return relative(ROOT, absPath).split(sep).join("/");
}

const IMPORT_RE = /(?:import|export)\s+(?:type\s+)?(?:[\s\S]*?)\s+from\s+["']([^"']+)["']|import\s*\(\s*["']([^"']+)["']\s*\)|require\(\s*["']([^"']+)["']\s*\)/g;
// ".d.ts" precisa vir antes de ".ts": `base + ".ts"` nunca bate pra um
// arquivo tipo "roles.d.ts" (o nome real seria "roles.d.ts", não "roles.ts"),
// mas checar as duas não faz mal — só uma vai existir de fato.
const CANDIDATE_EXT = [".d.ts", ".ts", ".tsx", ".js", ".jsx"];

// Infra exclusiva do modo demo deste repo (dados fake, deploy sem backend —
// ver content/docs/mock-data.mdx). Nunca deve entrar no registry: um projeto
// cliente que instala @kso/lojas não deve ganhar @faker-js/faker de brinde.
// A checagem é sobre o caminho já resolvido (relativo à raiz do repo).
const EXCLUDED_PATH_PREFIXES = ["src/lib/mock/"];
const EXCLUDED_PATHS = [];

function isExcludedPath(relPath) {
  return (
    EXCLUDED_PATHS.includes(relPath) ||
    EXCLUDED_PATH_PREFIXES.some((prefix) => relPath.startsWith(prefix))
  );
}

function resolveSpecifier(specifier, fromFile) {
  let base;
  const alias = ALIASES.find((a) => specifier.startsWith(a.prefix));
  if (alias) {
    base = join(ROOT, alias.target, specifier.slice(alias.prefix.length));
  } else if (specifier.startsWith(".")) {
    base = join(dirname(fromFile), specifier);
  } else {
    return { kind: "npm", name: normalizePkgName(specifier) };
  }

  if (existsSync(base) && !extname(base)) {
    for (const ext of CANDIDATE_EXT) {
      if (existsSync(base + ext)) return { kind: "file", path: base + ext };
    }
    for (const ext of CANDIDATE_EXT) {
      const idx = join(base, "index" + ext);
      if (existsSync(idx)) return { kind: "file", path: idx };
    }
    return { kind: "unresolved", spec: specifier };
  }

  if (existsSync(base)) return { kind: "file", path: base };

  for (const ext of CANDIDATE_EXT) {
    if (existsSync(base + ext)) return { kind: "file", path: base + ext };
  }

  return { kind: "unresolved", spec: specifier };
}

function normalizePkgName(specifier) {
  const parts = specifier.split("/");
  if (specifier.startsWith("@")) return parts.slice(0, 2).join("/");
  return parts[0];
}

function traceFrom(entryFiles) {
  const files = new Set();
  const npmPackages = new Set();
  const unresolved = new Set();
  const queue = [...entryFiles.map((f) => resolve(f))];

  while (queue.length) {
    const file = queue.pop();
    if (files.has(file)) continue;
    if (!existsSync(file)) {
      unresolved.add(file);
      continue;
    }
    files.add(file);

    const content = readFileSync(file, "utf8");
    let match;
    IMPORT_RE.lastIndex = 0;
    while ((match = IMPORT_RE.exec(content))) {
      const specifier = match[1] || match[2] || match[3];
      if (!specifier) continue;

      const resolved = resolveSpecifier(specifier, file);
      if (resolved.kind === "file") {
        const relPath = toRelPosix(resolved.path);
        if (isExcludedPath(relPath)) continue;
        if (!files.has(resolved.path)) queue.push(resolved.path);
      } else if (resolved.kind === "npm") {
        npmPackages.add(resolved.name);
      } else {
        unresolved.add(`${specifier} (from ${toRelPosix(file)})`);
      }
    }
  }

  return {
    files: [...files].map((f) => toRelPosix(f)).sort(),
    npmPackages: [...npmPackages].sort(),
    unresolved: [...unresolved].sort(),
  };
}

const entryArgs = process.argv.slice(2);
if (!entryArgs.length) {
  console.error("Uso: node scripts/registry/trace-imports.mjs <arquivo1> [arquivo2 ...]");
  process.exit(1);
}

const result = traceFrom(entryArgs);
console.log(JSON.stringify(result, null, 2));
