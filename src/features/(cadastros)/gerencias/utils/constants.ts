export const MODAL_KEYS_GERENCIA = {
  FORM: "gerencia-modal-form",
  CONFIRM_DELETE: "gerencia-confirm-delete",
};

export const QUERIES_KEYS_GERENCIA = {
  LIST: "gerencia",
  ITEM: (id: string) => ["gerencia", id],
};

export const MUTATION_KEYS_GERENCIA = {
  CREATE: "gerencia-mutation-create",
  UPDATE: "gerencia-mutation-update",
  DELETE: "gerencia-mutation-delete",
};
