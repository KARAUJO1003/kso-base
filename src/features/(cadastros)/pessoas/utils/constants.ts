export const MODAL_KEYS_PESSOA = {
  FORM: "pessoas-modal-form",
  CONFIRM_DELETE: "pessoas-confirm-delete",
};

export const QUERIES_KEYS_PESSOA = {
  LIST: "pessoas",
  ITEM: (id: string) => ["pessoas", id],
};

export const MUTATION_KEYS_PESSOA = {
  CREATE: "pessoas-mutation-create",
  UPDATE: "pessoas-mutation-update",
  DELETE: "pessoas-mutation-delete",
};
