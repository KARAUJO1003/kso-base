/**
 * Template for constants file
 * @module constants
 */

/**
 * Generate constants.ts template
 * @param {object} params - Template parameters
 * @param {string} params.UPPER - UPPER_CASE module name
 * @param {string} params.KEBAB - kebab-case module name
 * @returns {string} Constants template
 */
export function constantsTemplate(params) {
  const { UPPER, KEBAB } = params;

  return `export const MODAL_KEYS_${UPPER} = {
  FORM: "${KEBAB}-modal-form",
  CONFIRM_DELETE: "${KEBAB}-confirm-delete",
};

export const QUERIES_KEYS_${UPPER} = {
  LIST: "${KEBAB}",
  ITEM: (id: string) => ["${KEBAB}", id],
};

export const MUTATION_KEYS_${UPPER} = {
  CREATE: "${KEBAB}-mutation-create",
  UPDATE: "${KEBAB}-mutation-update",
  DELETE: "${KEBAB}-mutation-delete",
};
`;
}
