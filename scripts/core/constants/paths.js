/**
 * Common path constants for code generators
 * @module paths
 */

import path from "node:path";
import { fileURLToPath } from "node:url";

// Get __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Root directory of scripts
 */
export const SCRIPTS_DIR = path.resolve(__dirname, "..", "..");

/**
 * Source directory of the project
 */
export const SRC_DIR = path.resolve(SCRIPTS_DIR, "..", "src");

/**
 * Features directory
 */
export const FEATURES_DIR = path.join(SRC_DIR, "features");

/**
 * Components directory
 */
export const COMPONENTS_DIR = path.join(SRC_DIR, "components");

/**
 * Types directory (will be created if doesn't exist)
 */
export const TYPES_DIR = path.join(SRC_DIR, "types");

/**
 * Config directory
 */
export const CONFIG_DIR = path.join(SRC_DIR, "config");

/**
 * Lib directory
 */
export const LIB_DIR = path.join(SRC_DIR, "lib");

/**
 * App directory
 */
export const APP_DIR = path.join(SRC_DIR, "app");

/**
 * Feature flags config path
 */
export const FEATURE_FLAGS_CONFIG = path.join(
  LIB_DIR,
  "feature-flags",
  "flags.config.ts",
);

/**
 * Sidebar menu config path
 */
export const SIDEBAR_CONFIG = path.join(CONFIG_DIR, "sidebar-menu.config.ts");

/**
 * Site config path
 */
export const SITE_CONFIG = path.join(CONFIG_DIR, "site-config.ts");

/**
 * Get path for a feature module
 * @param {string} featureName - Feature name in kebab-case
 * @param {string} featureCategory - Optional category folder (e.g., "(cadastros)")
 * @returns {string} Feature directory path
 */
export function getFeaturePath(featureName, featureCategory = null) {
  if (featureCategory) {
    return path.join(FEATURES_DIR, featureCategory, featureName);
  }
  return path.join(FEATURES_DIR, featureName);
}

/**
 * Get path for feature components
 * @param {string} featureName - Feature name in kebab-case
 * @param {string} featureCategory - Optional category folder (e.g., "(cadastros)")
 * @returns {string} Feature components directory path
 */
export function getFeatureComponentsPath(featureName, featureCategory = null) {
  if (featureCategory) {
    return path.join(FEATURES_DIR, featureCategory, featureName, "components");
  }
  return path.join(FEATURES_DIR, featureName, "components");
}

/**
 * Get path for feature utils
 * @param {string} featureName - Feature name in kebab-case
 * @param {string} featureCategory - Optional category folder (e.g., "(cadastros)")
 * @returns {string} Feature utils directory path
 */
export function getFeatureUtilsPath(featureName, featureCategory = null) {
  if (featureCategory) {
    return path.join(FEATURES_DIR, featureCategory, featureName, "utils");
  }
  return path.join(FEATURES_DIR, featureName, "utils");
}

/**
 * Get path for types
 * @param {string} typeFolderName - Type folder name
 * @returns {string} Types directory path
 */
export function getTypesPath(typeFolderName) {
  return path.join(TYPES_DIR, typeFolderName);
}

/**
 * Get path for app page
 * @param {string} featureLocation - Feature location: "(root)" or "(auth)"
 * @param {string} featureName - Feature name in kebab-case
 * @param {string} pageCategory - Optional category folder (e.g., "(cadastros)")
 * @returns {string} Page directory path
 */
export function getPagePath(featureLocation, featureName, pageCategory = null) {
  const location = featureLocation === "(auth)" ? "(auth)" : "(root)";
  if (pageCategory) {
    return path.join(APP_DIR, location, pageCategory, featureName);
  }
  return path.join(APP_DIR, location, featureName);
}
