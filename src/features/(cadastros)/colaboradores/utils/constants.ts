export const MODAL_KEYS_COLABORADOR = {
  FORM: "colaboradores-modal-form",
  CONFIRM_DELETE: "colaboradores-confirm-delete",
};

export const QUERIES_KEYS_COLABORADOR = {
  LIST: "colaboradores",
  ITEM: (id: string) => ["colaboradores", id],
};

export const MUTATION_KEYS_COLABORADOR = {
  CREATE: "colaboradores-mutation-create",
  UPDATE: "colaboradores-mutation-update",
  DELETE: "colaboradores-mutation-delete",
};
