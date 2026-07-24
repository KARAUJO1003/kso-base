export const MODAL_KEYS_CARGO = {
  FORM: "cargos-modal-form",
  CONFIRM_DELETE: "cargos-confirm-delete",
};

export const QUERIES_KEYS_CARGO = {
  LIST: "cargos",
  ITEM: (id: string) => ["cargos", id],
};

export const MUTATION_KEYS_CARGO = {
  CREATE: "cargos-mutation-create",
  UPDATE: "cargos-mutation-update",
  DELETE: "cargos-mutation-delete",
};
