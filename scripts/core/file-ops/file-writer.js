/**
 * File system operations for code generators
 * @module file-writer
 */

import fs from "node:fs";
import path from "node:path";

/**
 * Create a file with content, creating directories if needed
 * @param {string} filePath - Full path to the file
 * @param {string} content - Content to write
 * @param {object} options - Options
 * @param {boolean} options.overwrite - Whether to overwrite if exists (default: false)
 * @returns {boolean} True if created, false if skipped (already exists)
 */
export function createFile(filePath, content, options = {}) {
  const { overwrite = false } = options;

  if (fs.existsSync(filePath) && !overwrite) {
    console.log(`  ⚠️  Já existe: ${path.relative(process.cwd(), filePath)}`);
    return false;
  }

  const dir = path.dirname(filePath);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(filePath, content, "utf-8");
  
  const relativePath = path.relative(process.cwd(), filePath);
  const action = overwrite && fs.existsSync(filePath) ? "Atualizado" : "Criado";
  console.log(`  ✅ ${action}: ${relativePath}`);
  
  return true;
}

/**
 * Create multiple files from an array
 * @param {Array<{dir: string, name: string, content: string}>} files - Array of file specs
 * @param {object} options - Options
 * @param {boolean} options.overwrite - Whether to overwrite if exists (default: false)
 * @returns {number} Number of files created
 */
export function batchCreateFiles(files, options = {}) {
  let created = 0;
  
  for (const file of files) {
    const filePath = path.join(file.dir, file.name);
    if (createFile(filePath, file.content, options)) {
      created++;
    }
  }
  
  return created;
}

/**
 * Create a directory recursively
 * @param {string} dirPath - Directory path
 * @returns {boolean} True if created
 */
export function createDirectory(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`  📁 Criado: ${path.relative(process.cwd(), dirPath)}`);
    return true;
  }
  return false;
}

/**
 * Check if a file exists
 * @param {string} filePath - File path
 * @returns {boolean} True if exists
 */
export function fileExists(filePath) {
  return fs.existsSync(filePath);
}

/**
 * Read file content
 * @param {string} filePath - File path
 * @returns {string} File content
 */
export function readFile(filePath) {
  return fs.readFileSync(filePath, "utf-8");
}

/**
 * Write file content (alias for createFile with overwrite)
 * @param {string} filePath - File path
 * @param {string} content - Content to write
 */
export function writeFile(filePath, content) {
  return createFile(filePath, content, { overwrite: true });
}
