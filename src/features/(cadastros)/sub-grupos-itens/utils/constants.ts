export const MODAL_KEYS_SUBGRUPOITEN = {
  FORM: "sub-grupos-itens-modal-form",
  CONFIRM_DELETE: "sub-grupos-itens-confirm-delete",
};

export const QUERIES_KEYS_SUBGRUPOITEN = {
  LIST: "sub-grupos-itens",
  ITEM: (id: string) => ["sub-grupos-itens", id],
};

export const MUTATION_KEYS_SUBGRUPOITEN = {
  CREATE: "sub-grupos-itens-mutation-create",
  UPDATE: "sub-grupos-itens-mutation-update",
  DELETE: "sub-grupos-itens-mutation-delete",
};
