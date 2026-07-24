export const MODAL_KEYS_ITEN = {
  FORM: "itens-modal-form",
  CONFIRM_DELETE: "itens-confirm-delete",
};

export const QUERIES_KEYS_ITEN = {
  LIST: "itens",
  ITEM: (id: string) => ["itens", id],
};

export const MUTATION_KEYS_ITEN = {
  CREATE: "itens-mutation-create",
  UPDATE: "itens-mutation-update",
  DELETE: "itens-mutation-delete",
};
