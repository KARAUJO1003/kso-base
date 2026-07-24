/**
 * Stub do subsistema offline. O template não inclui a fila offline completa
 * (IndexedDB, service worker, sync). Enquanto FEATURE_FLAGS.offline.enabled
 * for false, estas funções mantêm os pontos de integração existentes
 * (store-context, auth) inertes. Para portar o subsistema completo,
 * substitua este arquivo por uma implementação real.
 */
export const OFFLINE_DATABASE_NAME = "kso-base-offline";

export function requestOfflineSync(source?: string) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent("offline-sync-requested", {
      detail: { source },
    }),
  );
}
