import { api } from "@/lib/axios-instance";
import { DEMO_CONFIG } from "@/config/demo.config";

/**
 * Modo demo (deploy sem backend): troca o transporte do axios por um "banco"
 * fake gerado com @faker-js/faker. Ligado por NEXT_PUBLIC_ENABLE_MOCK_API
 * (ver src/config/demo.config.ts).
 *
 * De propósito FORA de axios-instance.ts: esse arquivo (e a pasta
 * src/lib/mock/ inteira) é infra exclusiva do modo demo deste repo — nunca
 * deve fazer parte do registry (@kso/base), que é o kernel que projetos
 * clientes instalam de verdade. Importado uma única vez, com efeito
 * colateral, em src/providers/root-providers.tsx.
 *
 * Pra voltar a um backend real: apague este arquivo + a pasta
 * src/lib/mock/ + o import dele em root-providers.tsx.
 */
if (DEMO_CONFIG.mockApi) {
  let mockAdapterPromise: Promise<typeof import("./adapter")> | null = null;
  api.defaults.adapter = async (config) => {
    mockAdapterPromise ??= import("./adapter");
    const { mockAdapter } = await mockAdapterPromise;
    return mockAdapter(config);
  };
}
