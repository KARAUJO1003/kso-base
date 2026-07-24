/**
 * Ponto central de configuração do "modo demo" (deploy sem backend).
 * As duas flags abaixo são as únicas chaves que ligam o modo demo — apague
 * este arquivo, `src/lib/mock/` e as poucas leituras de DEMO_CONFIG (ver
 * `docs/registry.md`-style doc em `content/docs/mock-data.mdx`) para voltar
 * 100% ao fluxo de API/autenticação reais.
 */
function readBooleanFlag(value: string | undefined): boolean {
  return value === "true" || value === "1";
}

export const DEMO_CONFIG = {
  /** Troca o adapter do axios por um "banco" fake gerado com @faker-js/faker. */
  mockApi: readBooleanFlag(process.env.NEXT_PUBLIC_ENABLE_MOCK_API),
  /** Pula o middleware de sessão e injeta um usuário admin fake em useAuth. */
  disableAuth: readBooleanFlag(process.env.NEXT_PUBLIC_DISABLE_AUTH),
} as const;
