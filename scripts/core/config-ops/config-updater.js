/**
 * Generic configuration file updater utilities
 * @module config-updater
 */

import fs from "node:fs";

/**
 * Update a configuration file by inserting content into a specific section
 * @param {object} config - Configuration object
 * @param {string} config.filePath - Path to config file
 * @param {RegExp} config.sectionPattern - Regex to find the section to update
 * @param {RegExp} config.insertPattern - Regex to find insertion point within section
 * @param {string} config.newContent - Content to insert
 * @param {RegExp} config.duplicateCheckPattern - Regex to check for duplicates
 * @param {string} config.sectionName - Name of section (for logging)
 * @param {boolean} config.createSection - Whether to create section if not found
 * @param {string} config.sectionTemplate - Template for new section (if createSection is true)
 * @param {RegExp} config.insertSectionPattern - Where to insert new section
 * @returns {object} Result with success boolean and message
 */
export function updateConfigFile(config) {
  const {
    filePath,
    sectionPattern,
    insertPattern,
    newContent,
    duplicateCheckPattern,
    sectionName = "config",
    createSection = false,
    sectionTemplate = "",
    insertSectionPattern = null,
  } = config;

  if (!fs.existsSync(filePath)) {
    return {
      success: false,
      message: `Arquivo não encontrado: ${filePath}`,
    };
  }

  let fileContent = fs.readFileSync(filePath, "utf-8");
  const sectionMatch = fileContent.match(sectionPattern);

  if (!sectionMatch) {
    if (!createSection || !insertSectionPattern) {
      return {
        success: false,
        message: `Seção "${sectionName}" não encontrada em ${filePath}`,
      };
    }

    // Create new section
    const insertSectionMatch = fileContent.match(insertSectionPattern);
    if (!insertSectionMatch) {
      return {
        success: false,
        message: `Não foi possível encontrar onde inserir a seção "${sectionName}"`,
      };
    }

    const insertPoint = insertSectionMatch.index + insertSectionMatch[0].length;
    fileContent =
      fileContent.slice(0, insertPoint) +
      sectionTemplate +
      fileContent.slice(insertPoint);

    fs.writeFileSync(filePath, fileContent, "utf-8");

    return {
      success: true,
      message: `Seção "${sectionName}" criada e conteúdo adicionado`,
    };
  }

  // Check for duplicates
  if (duplicateCheckPattern && sectionMatch[0].match(duplicateCheckPattern)) {
    return {
      success: false,
      message: `Conteúdo já existe em "${sectionName}"`,
    };
  }

  // Find insertion point within section
  const insertMatch = sectionMatch[0].match(insertPattern);
  if (!insertMatch) {
    return {
      success: false,
      message: `Não foi possível encontrar ponto de inserção em "${sectionName}"`,
    };
  }

  // Insert new content
  const updatedSection = sectionMatch[0].replace(
    insertPattern,
    (match, ...groups) => {
      // Find the content part (before the closing bracket/brace)
      const lastGroup = groups[groups.length - 3]; // Get the closing part
      return match.replace(lastGroup, newContent + lastGroup);
    }
  );

  fileContent = fileContent.replace(sectionMatch[0], updatedSection);
  fs.writeFileSync(filePath, fileContent, "utf-8");

  return {
    success: true,
    message: `Conteúdo adicionado a "${sectionName}"`,
  };
}

/**
 * Simple find and replace in a config file
 * @param {string} filePath - Path to file
 * @param {RegExp} pattern - Pattern to find
 * @param {string} replacement - Replacement string
 * @returns {object} Result with success boolean and message
 */
export function simpleReplace(filePath, pattern, replacement) {
  if (!fs.existsSync(filePath)) {
    return {
      success: false,
      message: `Arquivo não encontrado: ${filePath}`,
    };
  }

  let content = fs.readFileSync(filePath, "utf-8");
  
  if (!pattern.test(content)) {
    return {
      success: false,
      message: "Pattern não encontrado no arquivo",
    };
  }

  content = content.replace(pattern, replacement);
  fs.writeFileSync(filePath, content, "utf-8");

  return {
    success: true,
    message: "Conteúdo substituído com sucesso",
  };
}
