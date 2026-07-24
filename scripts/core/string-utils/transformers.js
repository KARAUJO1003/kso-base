/**
 * String transformation utilities for generators
 * @module transformers
 */

/**
 * Converts a string to PascalCase
 * @param {string} str - Input string
 * @returns {string} PascalCase string
 * @example toPascal("user-profile") // "UserProfile"
 */
export function toPascal(str) {
  return str
    .replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ""))
    .replace(/^(.)/, (_, c) => c.toUpperCase());
}

/**
 * Converts a string to camelCase
 * @param {string} str - Input string
 * @returns {string} camelCase string
 * @example toCamel("UserProfile") // "userProfile"
 */
export function toCamel(str) {
  const p = toPascal(str);
  return p.charAt(0).toLowerCase() + p.slice(1);
}

/**
 * Converts a string to kebab-case
 * @param {string} str - Input string
 * @returns {string} kebab-case string
 * @example toKebab("UserProfile") // "user-profile"
 */
export function toKebab(str) {
  return str
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/[\s_]+/g, "-")
    .toLowerCase();
}

/**
 * Converts a string to UPPER_SNAKE_CASE
 * @param {string} str - Input string
 * @returns {string} UPPER_SNAKE_CASE string
 * @example toUpper("user-profile") // "USER_PROFILE"
 */
export function toUpper(str) {
  return str.replace(/[-\s]+/g, "_").toUpperCase();
}
