import type { AxiosAdapter, AxiosResponse } from "axios";
import { fakeId } from "./factories/helpers";
import { ROUTE_TO_COLLECTION, getCollection, saveCollection } from "./db";

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function parsePath(url: string): { collection: string; id?: string } {
  const clean = url.replace(/^\/+/, "").replace(/\?.*$/, "");
  const [first, second] = clean.split("/");
  return { collection: first, id: second };
}

/**
 * `/auth/lojas` não é uma coleção genérica — é a lista de lojas do usuário
 * logado, com uma marcada como `selected`. Usada por StoreProvider
 * (src/contexts/store-context.tsx) em praticamente todo o app.
 */
function handleAuthLojas(config: any) {
  const lojas = getCollection("lojas");
  const authStores = lojas.map((loja, index) => ({
    _id: loja._id,
    codigo: loja.codigo,
    nome: loja.nome,
    deposito_default: loja.deposito_default,
    tabela_preco_default: loja.tabela_preco_default,
    branding: loja.branding,
    selected: index === 0,
  }));
  return ok(config, authStores);
}

function ok<T>(config: any, data: T, status = 200): AxiosResponse<T> {
  return {
    data,
    status,
    statusText: "OK",
    headers: {},
    config,
  } as AxiosResponse<T>;
}

function matchesSearch(record: any, search: string) {
  const needle = search.toLowerCase();
  return Object.values(record).some(
    (value) => typeof value === "string" && value.toLowerCase().includes(needle),
  );
}

function applyListParams(records: any[], params: Record<string, any> = {}) {
  let result = records;
  if (params.search) {
    result = result.filter((record) => matchesSearch(record, String(params.search)));
  }
  for (const [key, value] of Object.entries(params)) {
    if (key === "search" || key === "limit" || value == null || value === "") continue;
    result = result.filter((record) => {
      const fieldValue = record[key];
      const fieldId = fieldValue && typeof fieldValue === "object" ? fieldValue._id : fieldValue;
      return fieldId === value;
    });
  }
  if (params.limit) {
    result = result.slice(0, Number(params.limit));
  }
  return result;
}

/**
 * Adapter axios genérico: qualquer rota registrada em ROUTE_TO_COLLECTION
 * vira um CRUD completo em cima do banco fake (src/lib/mock/db.ts). Rotas
 * não registradas caem num fallback tolerante (não quebra o formulário/tela,
 * só não persiste de verdade) — ver docs em content/docs/mock-data.mdx.
 */
export const mockAdapter: AxiosAdapter = async (config) => {
  await delay(faker_delay());

  const method = (config.method || "get").toLowerCase();
  const { collection, id } = parsePath(config.url || "");

  if (method === "get" && collection === "auth" && id === "lojas") {
    return handleAuthLojas(config);
  }

  const knownCollection = ROUTE_TO_COLLECTION[collection];

  if (!knownCollection) {
    console.warn(`[mock-api] rota não mapeada: ${method.toUpperCase()} ${config.url}`);
    if (method === "get") return ok(config, { data: [], total: 0 });
    return ok(config, { ...(config.data ?? {}), _id: fakeId() }, 201);
  }

  const records = getCollection(knownCollection);

  if (method === "get" && !id) {
    const filtered = applyListParams(records, config.params);
    return ok(config, { data: filtered, total: records.length });
  }

  if (method === "get" && id) {
    const record = records.find((item) => item._id === id);
    if (!record) return rejectNotFound(config);
    return ok(config, record);
  }

  if (method === "post") {
    const body = parseBody(config.data);
    const now = new Date().toISOString();
    const record = { _id: fakeId(), ...body, createdAt: now, updatedAt: now };
    saveCollection(knownCollection, [record, ...records]);
    return ok(config, record, 201);
  }

  if ((method === "put" || method === "patch") && id) {
    const body = parseBody(config.data);
    let updated: any = null;
    const next = records.map((item) => {
      if (item._id !== id) return item;
      updated = { ...item, ...body, _id: id, updatedAt: new Date().toISOString() };
      return updated;
    });
    if (!updated) return rejectNotFound(config);
    saveCollection(knownCollection, next);
    return ok(config, updated);
  }

  if (method === "delete" && id) {
    saveCollection(knownCollection, records.filter((item) => item._id !== id));
    return ok(config, { success: true });
  }

  return ok(config, { data: [], total: 0 });
};

function faker_delay() {
  return 150 + Math.random() * 300;
}

function parseBody(data: unknown): Record<string, unknown> {
  if (data instanceof FormData) {
    const entries: Record<string, unknown> = {};
    data.forEach((value, key) => {
      entries[key] = value instanceof File ? value.name : value;
    });
    return entries;
  }
  if (typeof data === "string") {
    try {
      return JSON.parse(data);
    } catch {
      return {};
    }
  }
  return (data as Record<string, unknown>) ?? {};
}

function rejectNotFound(config: any) {
  const error: any = new Error("Registro não encontrado (mock)");
  error.isAxiosError = true;
  error.config = config;
  error.response = {
    status: 404,
    data: { message: "Registro não encontrado.", title: "Não encontrado" },
    config,
  };
  return Promise.reject(error);
}
