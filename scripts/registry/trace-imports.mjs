#!/usr/bin/env node
// Traça o grafo de imports internos a partir de um ou mais arquivos de entrada,
// pra descobrir automaticamente quais arquivos, primitivas @/components/ui/* e
// pacotes npm um módulo (feature) realmente usa em runtime.
//
// Uso: node scripts/registry/trace-imports.mjs <arquivo1> [arquivo2 ...]
// Saída: JSON em stdout { files, npmPackages, unresolved }

import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname, join, extname } from "node:path";

const ROOT = resolve(import.meta.dirname, "..", "..");
const SRC = join(ROOT, "src");

const IMPORT_RE = /(?:import|export)\s+(?:type\s+)?(?:[\s\S]*?)\s+from\s+["']([^"']+)["']|import\s*\(\s*["']([^"']+)["']\s*\)|require\(\s*["']([^"']+)["']\s*\)/g;
const CANDIDATE_EXT = [".ts", ".tsx", ".js", ".jsx"];

function resolveSpecifier(specifier, fromFile) {
  let base;
  if (specifier.startsWith("@/")) {
    base = join(SRC, specifier.slice(2));
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
        if (!files.has(resolved.path)) queue.push(resolved.path);
      } else if (resolved.kind === "npm") {
        npmPackages.add(resolved.name);
      } else {
        unresolved.add(`${specifier} (from ${file.replace(ROOT + "/", "")})`);
      }
    }
  }

  return {
    files: [...files].map((f) => f.replace(ROOT + "/", "")).sort(),
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
