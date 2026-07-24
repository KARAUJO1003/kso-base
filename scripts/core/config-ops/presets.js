/**
 * Preset configuration updaters for common scenarios
 * @module presets
 */

import fs from "node:fs";
import { FEATURE_FLAGS_CONFIG, SIDEBAR_CONFIG } from "../constants/paths.js";

/**
 * Update feature flags configuration to add a new module
 * @param {string} moduleKebab - Module name in kebab-case
 * @param {string} category - Category (e.g., "cadastros", "sistema") - default: "cadastros"
 * @returns {object} Result with success and message
 */
export function updateFeatureFlags(moduleKebab, category = "cadastros") {
  if (!fs.existsSync(FEATURE_FLAGS_CONFIG)) {
    return {
      success: false,
      message: `Feature flags config não encontrado: ${FEATURE_FLAGS_CONFIG}`,
    };
  }

  let flagsConfig = fs.readFileSync(FEATURE_FLAGS_CONFIG, "utf-8");

  // Find the category (e.g., modules.cadastros)
  const categoryRegex = new RegExp(
    `(${category}:\\s*\\{)([\\s\\S]*?)(\\n\\s*\\},)`,
    "m",
  );
  const categoryMatch = flagsConfig.match(categoryRegex);

  if (!categoryMatch) {
    return {
      success: false,
      message: `Categoria "${category}" não encontrada em FEATURE_FLAGS.modules`,
    };
  }

  // Check for duplicate
  if (categoryMatch[0].includes(`${moduleKebab}: {`)) {
    return {
      success: false,
      message: `Módulo "${moduleKebab}" já existe em FEATURE_FLAGS.modules.${category}`,
    };
  }

  // Create new module entry
  const newModule = `\n      ${moduleKebab}: {\n        criar: true,\n        editar: true,\n        visualizar: true,\n        excluir: ambientMode() === "development",\n      },`;

  // Add to category
  const updatedCategory = categoryMatch[0].replace(
    /(\{[\s\S]*?)(\n\s*\},)$/m,
    (m, p1, p2) => `${p1}${newModule}${p2}`,
  );

  flagsConfig = flagsConfig.replace(categoryMatch[0], updatedCategory);
  fs.writeFileSync(FEATURE_FLAGS_CONFIG, flagsConfig, "utf-8");

  return {
    success: true,
    message: `Feature flag adicionada para módulo "${moduleKebab}" em ${category}`,
  };
}

/**
 * Update sidebar configuration to add a new menu item
 * @param {object} options - Options
 * @param {string} options.title - Menu item title
 * @param {string} options.url - Menu item URL (with leading slash)
 * @param {string} options.section - Section name (default: "navMain")
 * @param {boolean} options.markAsDisabled - Mark item as disabled (default: false)
 * @param {boolean} options.markAsNew - Mark item as new (default: false)
 * @returns {object} Result with success and message
 */
export function updateSidebar(options) {
  const {
    title,
    url,
    section = "navMain",
    markAsDisabled = false,
    markAsNew = false,
  } = options;

  if (!fs.existsSync(SIDEBAR_CONFIG)) {
    return {
      success: false,
      message: `Sidebar config não encontrado: ${SIDEBAR_CONFIG}`,
    };
  }

  let sidebarConfig = fs.readFileSync(SIDEBAR_CONFIG, "utf-8");

  // Find the section array (e.g., navMain)
  const sectionRegex = new RegExp(
    `(${section}:\\s*\\[)([\\s\\S]*?)(\\n\\s*\\],)`,
    "m",
  );
  const sectionMatch = sidebarConfig.match(sectionRegex);

  if (!sectionMatch) {
    return {
      success: false,
      message: `Seção "${section}" não encontrada no sidebar config`,
    };
  }

  // Check for duplicate URL
  if (sectionMatch[0].includes(`url: "${url}"`)) {
    return {
      success: false,
      message: `URL "${url}" já existe na seção "${section}"`,
    };
  }

  // Create new menu item (simplified - no icon for now)
  const newItemObj = {
    title,
    icon: "IconFileDescription", // Default icon
    disabled: markAsDisabled,
    url,
    ...(markAsNew && { new: true }),
  };

  const newItem = `\n    ${JSON.stringify(newItemObj, null, 2)
    .split("\\n")
    .join("\\n    ")},`;

  // Add to section
  const updatedSection = sectionMatch[0].replace(
    /(\\[[\\s\\S]*?)(\\n\\s*\\],)$/m,
    (m, p1, p2) => `${p1}${newItem}${p2}`,
  );

  sidebarConfig = sidebarConfig.replace(sectionMatch[0], updatedSection);
  fs.writeFileSync(SIDEBAR_CONFIG, sidebarConfig, "utf-8");

  return {
    success: true,
    message: `Item "${title}" adicionado à seção "${section}" do sidebar`,
  };
}
