/**
 * Template for TypeScript types/interfaces
 * @module types
 */

/**
 * Generate types.ts template
 * @param {object} params - Template parameters
 * @param {string} params.INTERFACE - Interface name (e.g., IPermissao)
 * @param {string} params.mainFieldName - Main field name (e.g., name)
 * @returns {string} Types template
 */
export function typesTemplate(params) {
  const { INTERFACE, fields, mainFieldName } = params;

  const fieldLines =
    fields && fields.length > 0
      ? fields.map((f) => `  ${f.name}: string;`).join("\n")
      : `  ${mainFieldName}: string;`;

  return `export interface ${INTERFACE} {
  _id: string;
${fieldLines}
  createdAt: string;
  updatedAt: string;
}
`;
}
