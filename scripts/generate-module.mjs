/**
 * Module Generator Script - Refactored
 * Generates a complete CRUD module with all necessary files
 *
 * Usage:
 *   node scripts/generate-module.mjs
 *   echo "modulename\n..." | node scripts/generate-module.mjs
 */

import { ask, closeInput } from "./core/prompts/input-handler.js";
import { batchCreateFiles } from "./core/file-ops/file-writer.js";
import {
  toPascal,
  toCamel,
  toKebab,
  toUpper,
} from "./core/string-utils/transformers.js";
import {
  getPagePath,
  getTypesPath,
  getFeaturePath,
  getFeatureUtilsPath,
  getFeatureComponentsPath,
} from "./core/constants/paths.js";
import {
  updateFeatureFlags,
  updateSidebar,
} from "./core/config-ops/presets.js";
import { tableTemplate } from "./core/templates/react/table.js";
import { featureTemplate } from "./core/templates/react/feature.js";
import { typesTemplate } from "./core/templates/typescript/types.js";
import { formModalTemplate } from "./core/templates/react/form-modal.js";
import { editarModalTemplate } from "./core/templates/react/editar-modal.js";
import { constantsTemplate } from "./core/templates/typescript/constants.js";
import { tableColumnsTemplate } from "./core/templates/react/table-columns.js";
import { excluirModalTemplate } from "./core/templates/react/excluir-modal.js";
// Import templates
import { pageProtectedTemplate } from "./core/templates/react/page-protected.js";
import { moduleUtilsTemplate } from "./core/templates/typescript/module-utils.js";

// ── Main Script ──────────────────────────────────────────────────────────────
console.log("\n🔧 Gerador de Módulo (Novo Padrão)\n");

// Collect user inputs
const moduleName = await ask("1. Nome do módulo (ex: permissoes): ");
const moduleRoute =
  (await ask(`2. Rota do CRUD (ex: /permissoes) [/${moduleName}]: `)) ||
  `/${moduleName}`;
const pageTitle =
  (await ask(
    `3. Título da página (ex: Permissões) [${toPascal(moduleName)}]: `,
  )) || toPascal(moduleName);
const pageDescription =
  (await ask(`4. Descrição da página [Gerenciamento de ${pageTitle}.]: `)) ||
  `Gerenciamento de ${pageTitle}.`;
const entitySingular =
  (await ask(
    `5. Nome da entidade singular (ex: Permissao) [${toPascal(moduleName)}]: `,
  )) || toPascal(moduleName);
const typeFolderName =
  (await ask(
    `6. Pasta dos types (src/types/<pasta>) [${toKebab(moduleName)}]: `,
  )) || toKebab(moduleName);
const mainFieldNameRaw =
  (await ask(
    "7. Campo(s) da entidade (ex: name ou name,titulo,descricao) [name]: ",
  )) || "name";
const mainFieldLabelRaw =
  (await ask(
    `8. Label(s) dos campos (ex: Nome ou Nome,Título,Descrição) [Nome]: `,
  )) || "Nome";

// Parse comma-separated fields
const fieldNames = mainFieldNameRaw.split(",").map((s) => s.trim()).filter(Boolean);
const fieldLabelsList = mainFieldLabelRaw.split(",").map((s) => s.trim()).filter(Boolean);

// Assign labels: name-match first (case-insensitive), then position-based, then capitalize fallback
const usedLabelIndices = new Set();
const nameMatchedLabels = new Map();

// First pass: find labels that match a field name
for (let i = 0; i < fieldLabelsList.length; i++) {
  const label = fieldLabelsList[i];
  const matchIdx = fieldNames.findIndex(
    (n) => n.toLowerCase() === label.toLowerCase(),
  );
  if (matchIdx !== -1 && !nameMatchedLabels.has(fieldNames[matchIdx])) {
    nameMatchedLabels.set(fieldNames[matchIdx], label);
    usedLabelIndices.add(i);
  }
}

// Remaining labels (not name-matched), kept in order
const remainingLabels = fieldLabelsList.filter((_, i) => !usedLabelIndices.has(i));
let remainingIdx = 0;

const fields = fieldNames.map((name) => {
  if (nameMatchedLabels.has(name)) {
    return { name, label: nameMatchedLabels.get(name) };
  }
  if (remainingIdx < remainingLabels.length) {
    return { name, label: remainingLabels[remainingIdx++] };
  }
  // Fallback: capitalize field name
  return { name, label: name.charAt(0).toUpperCase() + name.slice(1) };
});

const mainFieldName = fields[0].name;
const mainFieldLabel = fields[0].label;
const featureLocation =
  (await ask("9. Caminho da feature: (root) ou (auth)? [(root)]: ")) ||
  "(root)";
const featureCategory =
  (await ask(
    "10. Categoria da feature (ex: (cadastros)) [deixe vazio para raiz]: ",
  )) || null;
const pageCategory =
  (await ask(
    "11. Categoria da página (ex: (cadastros)) [usar mesma da feature]: ",
  )) || featureCategory;
const permissionBase =
  (await ask(
    `12. Nome base da permissão (ex: clientes): [${toKebab(moduleName)}] `,
  )) || toKebab(moduleName);

closeInput();

// ── Derived names ────────────────────────────────────────────────────────────
const PASCAL = toPascal(entitySingular);
const CAMEL = toCamel(entitySingular);
const KEBAB = toKebab(moduleName);
const UPPER = toUpper(entitySingular);
const INTERFACE = `I${PASCAL}`;

// Template parameters
const templateParams = {
  PASCAL,
  CAMEL,
  KEBAB,
  UPPER,
  INTERFACE,
  pageTitle,
  pageDescription,
  moduleRoute,
  permissionBase,
  typeFolderName,
  mainFieldName,
  mainFieldLabel,
  fields,
  featureLocation,
  featureCategory,
  pageCategory,
};

// ── Define file structure ────────────────────────────────────────────────────
const FEATURES_DIR = getFeaturePath(KEBAB, featureCategory);
const COMPONENTS_DIR = getFeatureComponentsPath(KEBAB, featureCategory);
const UTILS_DIR = getFeatureUtilsPath(KEBAB, featureCategory);
const TYPES_DIR = getTypesPath(typeFolderName);
const PAGE_DIR = getPagePath(featureLocation, KEBAB, pageCategory);

const files = [
  // Types
  { dir: TYPES_DIR, name: "types.ts", content: typesTemplate(templateParams) },

  // Utils
  {
    dir: UTILS_DIR,
    name: "constants.ts",
    content: constantsTemplate(templateParams),
  },
  {
    dir: UTILS_DIR,
    name: "module-utils.ts",
    content: moduleUtilsTemplate(templateParams),
  },

  // Feature
  {
    dir: FEATURES_DIR,
    name: "feature.tsx",
    content: featureTemplate(templateParams),
  },

  // Components
  {
    dir: COMPONENTS_DIR,
    name: "table.tsx",
    content: tableTemplate(templateParams),
  },
  {
    dir: COMPONENTS_DIR,
    name: "table-columns.tsx",
    content: tableColumnsTemplate(templateParams),
  },
  {
    dir: COMPONENTS_DIR,
    name: `form-${KEBAB}.tsx`,
    content: formModalTemplate(templateParams),
  },
  {
    dir: COMPONENTS_DIR,
    name: `editar-${KEBAB}-modal.tsx`,
    content: editarModalTemplate(templateParams),
  },
  {
    dir: COMPONENTS_DIR,
    name: `excluir-${KEBAB}-modal.tsx`,
    content: excluirModalTemplate(templateParams),
  },

  // Page
  {
    dir: PAGE_DIR,
    name: "page.tsx",
    content: pageProtectedTemplate(templateParams),
  },
];

// ── Generate files ───────────────────────────────────────────────────────────
console.log("\n📁 Gerando módulo...\n");
const created = batchCreateFiles(files);

// ── Update configurations ────────────────────────────────────────────────────
console.log();

// Update feature flags
const flagsResult = updateFeatureFlags(KEBAB, "cadastros");
if (flagsResult.success) {
  console.log(`✅ ${flagsResult.message}`);
} else {
  console.log(`⚠️  ${flagsResult.message}`);
}

// Update sidebar
const sidebarResult = updateSidebar({
  title: pageTitle,
  url: `/${KEBAB}`,
  section: "navRegistrations",
  markAsDisabled: false,
  markAsNew: true,
});

if (sidebarResult.success) {
  console.log(`✅ ${sidebarResult.message}`);
} else {
  console.log(`⚠️  ${sidebarResult.message}`);
}

// ── Summary ──────────────────────────────────────────────────────────────────
console.log(`\n✨ Módulo "${pageTitle}" criado com sucesso!`);
console.log(`📦 ${created} arquivos criados`);
const featurePath = featureCategory ? `(cadastros)/${KEBAB}` : KEBAB;
const pagePath = pageCategory
  ? `${featureLocation}/${pageCategory}/${KEBAB}`
  : `${featureLocation}/${KEBAB}`;
console.log(`📍 Feature: src/features/${featurePath}`);
console.log(`📍 Page: src/app/${pagePath}`);
console.log(`📍 Types: src/types/${typeFolderName}\n`);
