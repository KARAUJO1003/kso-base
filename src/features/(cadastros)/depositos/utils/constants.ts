export const MODAL_KEYS_DEPOSITO = {
  FORM: "deposito-modal-form",
  CONFIRM_DELETE: "deposito-confirm-delete",
};

export const QUERIES_KEYS_DEPOSITO = {
  LIST: "deposito",
  ITEM: (id: string) => ["deposito", id],
};

export const MUTATION_KEYS_DEPOSITO = {
  CREATE: "deposito-mutation-create",
  UPDATE: "deposito-mutation-update",
  DELETE: "deposito-mutation-delete",
};
