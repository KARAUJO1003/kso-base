export const MODAL_KEYS_LOJA = {
  FORM: "lojas-modal-form",
  CONFIRM_DELETE: "lojas-confirm-delete",
};

export const QUERIES_KEYS_LOJA = {
  LIST: "lojas",
  ITEM: (id: string) => ["lojas", id],
};

export const MUTATION_KEYS_LOJA = {
  CREATE: "lojas-mutation-create",
  UPDATE: "lojas-mutation-update",
  DELETE: "lojas-mutation-delete",
};
