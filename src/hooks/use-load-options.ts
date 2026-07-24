import { useCallback } from "react";
import { api, ApiListResponse } from "@/lib/axios-instance";

type LoadOptionsContext = {
  limit?: number;
  signal?: AbortSignal;
};

type UseLoadOptionsParams = {
  route: string;
  /**
   * Parâmetros adicionais a serem enviados na requisição
   */
  params?: Record<string, any>;
  /**
   * Permite habilitar/desabilitar o hook dinamicamente
   * @default true
   */
  enabled?: boolean;
  defaultLimit?: number;
};

const EMPTY_PARAMS: Record<string, any> = {};

/**
 * Hook genérico para carregar opções assíncronas em componentes ComboboxSelect
 *
 * @example
 * ```tsx
 * const loadGerencias = useLoadOptions<IGerencia>({
 *   route: MODULE_ROUTE_GERENCIA
 * });
 *
 * <FormFields.ComboboxSelect<FormSchemaType, IGerencia>
 *   name="gerencia"
 *   label="Gerência"
 *   loadOptions={loadGerencias}
 *   // ... outras props
 * />
 * ```
 */
export function useLoadOptions<TOption = any>({
  route,
  defaultLimit = 10,
  params = EMPTY_PARAMS,
  enabled = true,
}: UseLoadOptionsParams) {
  const loadOptions = useCallback(
    async (
      search: string,
      { limit = defaultLimit, signal }: LoadOptionsContext = {},
    ): Promise<TOption[]> => {
      if (!enabled) {
        return [];
      }

      try {
        const response = await api.get<ApiListResponse<TOption>>(route, {
          signal,
          params: {
            search,
            limit,
            ...params,
          },
        });

        return response.data.data || [];
      } catch (error) {
        // Se a requisição foi cancelada (AbortError), retorna array vazio
        if (signal?.aborted) {
          return [];
        }

        // Para outros erros, relança para permitir tratamento adequado
        throw error;
      }
    },
    [route, defaultLimit, params, enabled],
  );

  return loadOptions;
}
