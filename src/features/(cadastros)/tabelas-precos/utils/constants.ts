export const MODAL_KEYS_TABELASPRECOS = {
  FORM: "tabelas-precos-modal-form",
  PRICE_ITEM: "tabelas-precos-price-item-modal-form",
  CONFIRM_DELETE: "tabelas-precos-confirm-delete",
};

export const QUERIES_KEYS_TABELASPRECOS = {
  LIST: "tabelas-precos",
  ITEM_PRECOS: "item-precos",
  ITEM: (id: string) => ["tabelas-precos", id],
};

export const MUTATION_KEYS_TABELASPRECOS = {
  CREATE: "tabelas-precos-mutation-create",
  UPSERT_PRICE_ITEM: "tabelas-precos-mutation-upsert-price-item",
  UPDATE: "tabelas-precos-mutation-update",
  DELETE: "tabelas-precos-mutation-delete",
};
