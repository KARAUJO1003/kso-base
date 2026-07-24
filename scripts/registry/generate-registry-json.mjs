#!/usr/bin/env node
// Monta o registry.json (raiz) a partir dos manifests classificados em
// scripts/registry/*.json (gerados por trace-imports.mjs + classify.mjs +
// direct-cross-refs.mjs). Ver docs/registry.md para o processo completo.
//
// Uso: node scripts/registry/generate-registry-json.mjs

import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..", "..");
const MANIFEST_DIR = join(ROOT, "scripts", "registry", "manifests");

const PILOT_MODULES = {
  lojas: { title: "Lojas", description: "Cadastro de lojas, com identidade visual (branding) por loja." },
  depositos: { title: "Depósitos", description: "Cadastro de depósitos vinculados a uma loja." },
  "tabelas-precos": { title: "Tabelas de Preço", description: "Cadastro de tabelas de preço e itens de preço." },
  itens: { title: "Itens", description: "Cadastro de itens (produtos), com estoque e composição." },
  "grupos-itens": { title: "Grupos de Itens", description: "Cadastro de grupos de itens." },
  "unidade-medida": { title: "Unidade de Medida", description: "Cadastro de unidades de medida por loja." },
};

function fileType(path) {
  if (path.startsWith("src/hooks/")) return "registry:hook";
  if (path.startsWith("src/app/")) return "registry:page";
  if (path.startsWith("src/components/ui/")) return "registry:ui";
  if (path.startsWith("src/components/")) return "registry:component";
  if (path.startsWith("src/features/") && path.includes("/components/")) return "registry:component";
  return "registry:lib";
}

function toFileEntry(path) {
  return { path, type: fileType(path), target: `~/${path.replace(/^src\//, "src/")}` };
}

function loadManifest(name) {
  return JSON.parse(readFileSync(join(MANIFEST_DIR, `classified-${name}.json`), "utf8"));
}

const baseUnion = JSON.parse(readFileSync(join(MANIFEST_DIR, "base-union.json"), "utf8"));
const crossRefs = JSON.parse(readFileSync(join(MANIFEST_DIR, "cross-refs.json"), "utf8"));

const items = [];

items.push({
  name: "base",
  type: "registry:lib",
  title: "kso-base — kernel compartilhado",
  description:
    "Hooks (use-crud, use-modal-instance), contexts/providers (store, modal, auth), " +
    "camada de permissões e feature flags, DataTable, FormFields e demais componentes " +
    "ui/ próprios (combobox, image-upload, multi-select, native-select). Pré-requisito " +
    "de todos os módulos de negócio deste registry.",
  files: baseUnion.base.map(toFileEntry),
  registryDependencies: [
    ...baseUnion.stockUi,
    ...baseUnion.vendoredExternal.map((name) => `@reui/${name}`),
  ],
  dependencies: baseUnion.npmPackages,
});

for (const [slug, meta] of Object.entries(PILOT_MODULES)) {
  const manifest = loadManifest(slug);
  const crossModules = crossRefs[slug] || [];
  items.push({
    name: slug,
    type: "registry:block",
    title: meta.title,
    description: meta.description,
    files: manifest.own.map(toFileEntry),
    registryDependencies: [
      "@kso/base",
      ...crossModules.map((m) => `@kso/${m}`),
    ],
  });
}

items.push({
  name: "cadastros",
  type: "registry:block",
  title: "Cadastros (piloto)",
  description:
    "Meta-item sem arquivos próprios: instala de uma vez o subconjunto de módulos de " +
    "cadastro já publicados neste registry. Os demais módulos de (cadastros) ainda não " +
    "foram migrados — ver docs/registry.md.",
  files: [],
  registryDependencies: Object.keys(PILOT_MODULES).map((slug) => `@kso/${slug}`),
});

items.push({
  name: "image-upload",
  type: "registry:ui",
  title: "Image Upload",
  description:
    "Campo de upload de imagem com preview, drag&drop e validação de tamanho/tipo. " +
    "100% standalone: não depende do kernel base, só de src/lib/utils.ts.",
  files: [
    toFileEntry("src/components/ui/image-upload.tsx"),
    toFileEntry("src/lib/utils.ts"),
  ],
  dependencies: ["clsx", "lucide-react", "next", "react", "sonner", "tailwind-merge"],
});

const registry = {
  $schema: "https://ui.shadcn.com/schema/registry.json",
  name: "kso",
  homepage: "https://kso-base.vercel.app",
  items,
};

writeFileSync(join(ROOT, "registry.json"), JSON.stringify(registry, null, 2) + "\n");
console.log(`registry.json gerado com ${items.length} itens.`);
