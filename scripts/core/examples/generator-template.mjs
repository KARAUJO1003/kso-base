/**
 * Generator Template - Example
 * 
 * This is a template showing how to create a new generator script
 * using the core utilities.
 * 
 * Usage:
 *   1. Copy this file to scripts/
 *   2. Rename it (e.g., generate-component.mjs)
 *   3. Customize the prompts and templates
 *   4. Run: node scripts/your-generator.mjs
 */

import path from "node:path";
import { COMPONENTS_DIR } from "./core/constants/paths.js";
import { createFile } from "./core/file-ops/file-writer.js";
import { ask, closeInput } from "./core/prompts/input-handler.js";
import { toPascal, toKebab } from "./core/string-utils/transformers.js";

// ── Main Script ──────────────────────────────────────────────────────────────
console.log("\n🔧 Example Generator\n");

// Step 1: Collect user inputs
const componentName = await ask("Component name: ");

closeInput();

// Step 2: Derive names using transformers
const PASCAL = toPascal(componentName);
const KEBAB = toKebab(componentName);

// Step 3: Create your template (inline or imported from core/templates/)
const componentTemplate = `import React from "react";

interface ${PASCAL}Props {
  className?: string;
}

export function ${PASCAL}({ className }: ${PASCAL}Props) {
  return (
    <div className={className}>
      <h2>${PASCAL} Component</h2>
    </div>
  );
}
`;

// Step 4: Define file path
const filePath = path.join(COMPONENTS_DIR, `${KEBAB}.tsx`);

// Step 5: Create file
console.log("\\n📁 Creating file...\\n");
createFile(filePath, componentTemplate);

// Step 6: Optional - Update configurations
// Example: updateFeatureFlags(), updateSidebar()

console.log(`\\n✨ Component "${PASCAL}" created successfully!\\n`);

/**
 * Available Utilities:
 * 
 * From string-utils/transformers.js:
 *   - toPascal(str)  → "UserProfile"
 *   - toCamel(str)   → "userProfile"
 *   - toKebab(str)   → "user-profile"
 *   - toUpper(str)   → "USER_PROFILE"
 * 
 * From prompts/input-handler.js:
 *   - ask(question)  → Promise<string>
 *   - closeInput()   → Close readline interface
 *   - isInteractive() → boolean
 * 
 * From file-ops/file-writer.js:
 *   - createFile(path, content, options)
 *   - batchCreateFiles(filesArray, options)
 *   - createDirectory(path)
 *   - fileExists(path)
 *   - readFile(path)
 *   - writeFile(path, content)
 * 
 * From constants/paths.js:
 *   - SCRIPTS_DIR, SRC_DIR, FEATURES_DIR, COMPONENTS_DIR
 *   - TYPES_DIR, CONFIG_DIR, LIB_DIR, APP_DIR
 *   - FEATURE_FLAGS_CONFIG, SITE_CONFIG
 *   - getFeaturePath(name)
 *   - getFeatureComponentsPath(name)
 *   - getFeatureUtilsPath(name)
 *   - getTypesPath(name)
 *   - getPagePath(location, name)
 * 
 * From config-ops/presets.js:
 *   - updateFeatureFlags(moduleKebab)
 *   - updateSidebar({ title, url, section, markAsNew })
 * 
 * From config-ops/config-updater.js:
 *   - updateConfigFile(config)  → Advanced config updates
 *   - simpleReplace(path, pattern, replacement)
 */
