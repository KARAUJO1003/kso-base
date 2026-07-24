import { times } from "./factories/helpers";
import {
  createPessoa, createGrupoLoja, createGerencia, createCargo, createCentroCusto,
  createLoja, createSetor, createColaborador, createFornecedor,
} from "./factories/organizacao";
import {
  createUnidadeMedida, createGrupoItem, createSubGrupoItem, createDeposito,
  createTabelaPreco, createFormaPagamento, createMotivoTroca, createItem,
} from "./factories/inventario";
import {
  createSistema, createPermissao, createModuloPermissao, createRole, createUser,
} from "./factories/seguranca";

/** rota da API (sem barra inicial) -> nome da coleção fake */
export const ROUTE_TO_COLLECTION: Record<string, string> = {
  cargos: "cargos",
  "centros-custos": "centros-custos",
  colaboradores: "colaboradores",
  depositos: "depositos",
  "formas-pagamentos": "formas-pagamentos",
  fornecedores: "fornecedores",
  gerencias: "gerencias",
  "grupos-itens": "grupos-itens",
  "loja-grupos": "grupos-lojas",
  itens: "itens",
  lojas: "lojas",
  "motivos-trocas": "motivos-trocas",
  pessoas: "pessoas",
  setores: "setores",
  "sub-grupos-itens": "sub-grupos-itens",
  "tabela-precos": "tabelas-precos",
  "unidades-medidas": "unidade-medida",
  users: "users",
  roles: "roles",
  permissoes: "permissoes",
  "permissao-grupos": "permissao-grupos",
  sistemas: "sistemas",
};

type MockDatabase = Record<string, any[]>;

// Suba a versão sempre que mudar o shape/comportamento do seed (ver
// seedDatabase abaixo) — invalida o banco fake já salvo em quem já visitou
// o site, forçando gerar de novo com as mudanças.
const STORAGE_KEY = "kso-mock-db:v2";

function seedDatabase(): MockDatabase {
  const pessoas = times(30, createPessoa);
  const sistemas = times(3, createSistema);
  const cargos = times(8, createCargo);
  const centrosCusto = times(5, createCentroCusto);
  const gerencias = times(5, createGerencia);
  const gruposItens = times(6, createGrupoItem);
  const subGruposItens = times(10, createSubGrupoItem);
  const gruposLojas = times(4, createGrupoLoja);
  const motivosTrocas = times(6, createMotivoTroca);
  const formasPagamento = times(5, createFormaPagamento);
  const permissoes = times(20, createPermissao);
  const depositos = times(8, createDeposito);
  const tabelasPrecos = times(4, createTabelaPreco);

  const lojas = times(6, (i) => createLoja(i, gruposLojas));
  const setores = times(10, (i) => createSetor(i, lojas));
  const unidadesMedida = times(12, (i) => createUnidadeMedida(i, lojas));
  const fornecedores = times(15, (i) => createFornecedor(i, { pessoas, lojas }));
  const colaboradores = times(20, (i) =>
    createColaborador(i, { pessoas, gerencias, setores, cargos, centrosCusto }),
  );

  const permissaoGrupos = times(10, (i) => createModuloPermissao(i, { sistemas, permissoes }));
  const roles = times(5, (i) => createRole(i, permissaoGrupos));

  const itens = times(40, (i) =>
    createItem(i, { gruposItens, unidadesMedida, depositos, lojas, tabelasPrecos, fornecedores }),
  );

  const users = times(12, (i) => createUser(i, { lojas, roles, setores }));

  return {
    pessoas, sistemas, cargos, "centros-custos": centrosCusto, gerencias,
    "grupos-itens": gruposItens, "sub-grupos-itens": subGruposItens,
    "grupos-lojas": gruposLojas, "motivos-trocas": motivosTrocas,
    "formas-pagamentos": formasPagamento, permissoes, depositos,
    "tabelas-precos": tabelasPrecos, lojas, setores,
    "unidade-medida": unidadesMedida, fornecedores, colaboradores,
    "permissao-grupos": permissaoGrupos, roles, itens, users,
  };
}

let db: MockDatabase | null = null;

function loadFromStorage(): MockDatabase | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as MockDatabase) : null;
  } catch {
    return null;
  }
}

function persistToStorage(next: MockDatabase) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // localStorage cheio/indisponível (modo privado) — segue só em memória.
  }
}

/** Retorna (e memoiza) o banco fake. Persiste em localStorage pra sobreviver a refresh. */
export function getMockDb(): MockDatabase {
  if (db) return db;
  db = loadFromStorage() ?? seedDatabase();
  persistToStorage(db);
  return db;
}

export function getCollection(collection: string): any[] {
  const database = getMockDb();
  if (!database[collection]) database[collection] = [];
  return database[collection];
}

export function saveCollection(collection: string, next: any[]) {
  const database = getMockDb();
  database[collection] = next;
  persistToStorage(database);
}

/** Apaga o banco fake persistido e força gerar de novo no próximo acesso. */
export function resetMockDb() {
  db = null;
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(STORAGE_KEY);
  }
}
