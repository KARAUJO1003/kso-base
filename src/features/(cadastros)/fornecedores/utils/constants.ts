export const MODAL_KEYS_FORNECEDOR = {
  FORM: "fornecedores-modal-form",
  CONFIRM_DELETE: "fornecedores-confirm-delete",
};

export const QUERIES_KEYS_FORNECEDOR = {
  LIST: "fornecedores",
  ITEM: (id: string) => ["fornecedores", id],
};

export const MUTATION_KEYS_FORNECEDOR = {
  CREATE: "fornecedores-mutation-create",
  UPDATE: "fornecedores-mutation-update",
  DELETE: "fornecedores-mutation-delete",
};
