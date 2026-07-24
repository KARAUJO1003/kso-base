/**
 * Template for module utils file
 * @module module-utils
 */

/**
 * Generate module-utils.ts template
 * @param {object} params - Template parameters
 * @param {string} params.pageTitle - Page title
 * @param {string} params.moduleRoute - Module route (e.g., /permissoes)
 * @param {string} params.permissionBase - Permission base name (e.g., clientes)
 * @param {string} params.KEBAB - kebab-case module name
 * @returns {string} Module utils template
 */
export function moduleUtilsTemplate(params) {
  const { pageTitle, moduleRoute, permissionBase, KEBAB } = params;

  return `// Configurações técnicas do módulo ${pageTitle}
export const MODULE_ROUTE = "${moduleRoute}";
export const PERMISSIONS = {
  create: "criar",
  edit: "editar",
  delete: "excluir",
  view: "ver",
};
export const MODULE_CONFIG = {
  moduleSlug: "${KEBAB}",
};
`;
}
