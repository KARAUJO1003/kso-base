function ambientMode() {
  const appEnv =
    process.env.NEXT_PUBLIC_APP_ENV ||
    process.env.APP_ENV ||
    process.env.NODE_ENV;

  if (appEnv === "production") {
    return "production";
  }

  return "development";
}

const BASE_FLAGS = {
  criar: true,
  editar: true,
  visualizar: true,
  excluir: ambientMode() === "development",
};

export const FEATURE_FLAGS = {
  /**
   * Funcionalidades pesadas do template, plugáveis por cliente/projeto.
   * offline.enabled: o template não traz o subsistema completo de fila
   * offline (IndexedDB/service worker) — ver src/hooks/use-crud.ts. Deixe
   * false até implementar `lib/offline/*` de verdade.
   */
  websocket: {
    enabled: true,
  },
  pwa: {
    enabled: false,
  },
  offline: {
    enabled: false,
  },
  modules: {
    dashboard: {
      visualizar: true,
    },
    administrativo: {
      users: BASE_FLAGS,
      roles: BASE_FLAGS,
      permissions: BASE_FLAGS,
      modules: BASE_FLAGS,
      systems: BASE_FLAGS,
      parametros: BASE_FLAGS,
      lembretes: BASE_FLAGS,
    },
    organizacao: {
      lojas: BASE_FLAGS,
      gruposLojas: BASE_FLAGS,
      setores: BASE_FLAGS,
      gerencia: BASE_FLAGS,
      cargos: BASE_FLAGS,
      colaboradores: BASE_FLAGS,
      pessoas: BASE_FLAGS,
      fornecedores: BASE_FLAGS,
    },
    inventario: {
      unidadeMedida: BASE_FLAGS,
      gruposItens: BASE_FLAGS,
      subGruposItens: BASE_FLAGS,
      itens: BASE_FLAGS,
      deposito: BASE_FLAGS,
      tabelasPrecos: BASE_FLAGS,
      centrosCustos: BASE_FLAGS,
      formasPagamento: BASE_FLAGS,
      motivosTrocas: BASE_FLAGS,
    },
  },
} as const;
