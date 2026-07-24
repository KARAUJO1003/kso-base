import { toast } from "sonner";
import {
  useQuery,
  useMutation,
  useQueryClient,
  UndefinedInitialDataOptions,
} from "@tanstack/react-query";
import { AxiosRequestConfig } from "axios";
import { api } from "@/lib/axios-instance";
import { crudMessages } from "@/lib/messages";
import { isEnabled } from "@/lib/feature-flags/feature-flag";

function getEntityId(entity: unknown) {
  if (!entity || typeof entity !== "object") return undefined;

  const record = entity as { _id?: unknown; id?: unknown };

  return typeof record._id === "string"
    ? record._id
    : typeof record.id === "string"
      ? record.id
      : undefined;
}

function getListFromPayload(payload: unknown) {
  if (Array.isArray(payload)) return payload;

  if (payload && typeof payload === "object" && "data" in payload) {
    const data = (payload as { data?: unknown }).data;
    return Array.isArray(data) ? data : null;
  }

  return null;
}

function replaceListInPayload(payload: unknown, nextList: unknown[]) {
  if (Array.isArray(payload)) return nextList;

  if (payload && typeof payload === "object" && "data" in payload) {
    return {
      ...(payload as Record<string, unknown>),
      data: nextList,
      total:
        typeof (payload as { total?: unknown }).total === "number"
          ? nextList.length
          : (payload as { total?: unknown }).total,
    };
  }

  return payload;
}

function updateOfflineQueryCaches(
  queryClient: ReturnType<typeof useQueryClient>,
  queryInvalidationKeys: string[] | undefined,
  updater: (payload: unknown) => unknown,
) {
  queryInvalidationKeys?.forEach((key) => {
    const queries = queryClient.getQueriesData({ queryKey: [key] });

    queries.forEach(([queryKey, payload]) => {
      queryClient.setQueryData(queryKey, updater(payload));
    });
  });
}

function createOfflineRecord(data: unknown) {
  const record = data && typeof data === "object" ? data as Record<string, unknown> : {};
  const offline = record.__offline as { clientMutationId?: string } | undefined;

  return {
    ...record,
    _id:
      typeof record._id === "string"
        ? record._id
        : `offline:${offline?.clientMutationId ?? Date.now()}`,
  };
}

function prependOfflineRecord(payload: unknown, data: unknown) {
  const list = getListFromPayload(payload);

  if (!list) return payload;

  const record = createOfflineRecord(data);
  const recordId = getEntityId(record);
  const nextList = recordId
    ? list.filter((item) => getEntityId(item) !== recordId)
    : list;

  return replaceListInPayload(payload, [record, ...nextList]);
}

function mergeOfflineRecord(payload: unknown, data: unknown, id: string) {
  const list = getListFromPayload(payload);

  if (!list) return payload;

  return replaceListInPayload(
    payload,
    list.map((item) => {
      if (getEntityId(item) !== id) return item;

      return {
        ...(item as Record<string, unknown>),
        ...(data as Record<string, unknown>),
        _id: id,
      };
    }),
  );
}

function removeOfflineRecord(payload: unknown, id: string) {
  const list = getListFromPayload(payload);

  if (!list) return payload;

  return replaceListInPayload(
    payload,
    list.filter((item) => getEntityId(item) !== id),
  );
}

/**
 * O template não inclui o subsistema completo de fila offline (IndexedDB,
 * service worker, sync). Enquanto FEATURE_FLAGS.offline.enabled for false,
 * este helper sempre retorna false e os ramos de merge acima nunca rodam.
 * Para portar o offline completo, implemente `lib/offline/*` (IndexedDB,
 * service worker, sync) e troque este helper por uma versão real de
 * `isOfflineQueuedPayload`.
 */
function isOfflineQueuedPayload(value: unknown): boolean {
  if (!isEnabled("offline.enabled")) return false;

  return Boolean(
    value &&
      typeof value === "object" &&
      "__offline" in value &&
      (value as { __offline?: { queued?: boolean } }).__offline?.queued,
  );
}

const getMutationErrorMessage = (error: Error, fallback: string) => {
  const maybeError = error as Error & {
    response?: { data?: { message?: string; title?: string } };
  };
  return (
    maybeError.response?.data?.message ||
    maybeError.response?.data?.title ||
    error.message ||
    fallback
  );
};

export interface UseFetchResponse<T> extends UndefinedInitialDataOptions<
  T,
  Error,
  T,
  readonly unknown[]
> {
  route: string;
  config?: AxiosRequestConfig<any> | undefined;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

interface UseCustomMutationsProps<T> {
  route: string;
  mutationKey: string[];
  queryInvalidationKeys?: string[];
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  config?: AxiosRequestConfig<any> | undefined;
  onMutate?:
  | ((
    variables: {
      formData: T;
      id: string;
    },
    context: any,
  ) => void | Promise<void>)
  | undefined;
}

/**
 * Hook para buscar dados via GET usando React Query.
 *
 * @example
 * const { data, isLoading, isError, error } = useFetch<Produto[]>({
 *   queryKey: ['produtos'],
 *   route: '/produtos',
 *   config: { params: { ativo: true } },
 *   sortBy: 'nome',
 *   sortOrder: 'asc',
 * });
 *
 * @param route     Rota da API relativa ao baseURL (ex: '/clientes/sap/zsd005')
 * @param config    Configuração adicional do Axios (params, headers, etc.)
 * @param queryKey  Chave única do React Query para cache e invalidação
 * @param sortBy    Campo para ordenação (opcional)
 * @param sortOrder Ordem da ordenação: 'asc' ou 'desc' (padrão: 'asc')
 * @param rest      Demais opções do useQuery (staleTime, enabled, etc.)
 */

export const useFetch = <T = any>({
  route,
  config,
  queryKey,
  sortBy,
  sortOrder = "asc",
  ...rest
}: UseFetchResponse<T>) => {
  return useQuery<T, Error, T, readonly unknown[]>({
    ...rest,
    queryKey,
    queryFn: async (): Promise<T> => {
      const result = await api.get(route, {
        ...config,
      });
      const payload = rest.meta?.rawResponse ? result : result.data;
      const response =
        payload && typeof payload === "object" && "data" in payload
          ? payload.data
          : payload;

      if (sortBy && Array.isArray(response)) {
        return response.sort((a: any, b: any) => {
          const aValue = a[sortBy];
          const bValue = b[sortBy];

          if (aValue === bValue) return 0;

          const comparison = aValue > bValue ? 1 : -1;
          return sortOrder === "desc" ? -comparison : comparison;
        }) as T;
      }

      return (response ?? []) as T;
    },
  });
};

export function useCreate<T>({
  route,
  queryInvalidationKeys,
  onSuccess,
  onError,
  mutationKey,
  config,
}: UseCustomMutationsProps<T>) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey,
    mutationFn: async ({ formData }: { formData?: T } = {}) => {
      const response = await api.post<T>(route, formData, {
        ...config,
        headers:
          formData instanceof FormData
            ? { "Content-Type": "multipart/form-data" }
            : undefined,
      });
      return response.data;
    },
    onSuccess: (data: T) => {
      if (isOfflineQueuedPayload(data)) {
        updateOfflineQueryCaches(queryClient, queryInvalidationKeys, (payload) =>
          prependOfflineRecord(payload, data),
        );
      }

      if (onSuccess) {
        onSuccess(data);
      } else if (isOfflineQueuedPayload(data)) {
        toast.success(crudMessages.offlineQueuedCreate, {
          description: crudMessages.offlineQueuedDescription,
        });
      } else {
        toast.success(crudMessages.createSuccess);
      }
    },
    onSettled: () => {
      queryInvalidationKeys?.forEach((key) => {
        queryClient.invalidateQueries({
          queryKey: [key],
        });
      });
    },
  });
}

export function useUpdate<T>({
  route,
  queryInvalidationKeys,
  mutationKey,
  onSuccess,
  onError,
  onMutate,
}: UseCustomMutationsProps<T>) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey,
    mutationFn: async ({ formData, id }: { formData: T; id: string }) => {
      const response = await api.put<T>(`${route}/${id}`, formData, {
        headers:
          formData instanceof FormData
            ? { "Content-Type": "multipart/form-data" }
            : undefined,
      });
      return response.data;
    },
    onSuccess: (data: T, variables) => {
      if (isOfflineQueuedPayload(data)) {
        updateOfflineQueryCaches(queryClient, queryInvalidationKeys, (payload) =>
          mergeOfflineRecord(payload, data, variables.id),
        );
      }

      if (onSuccess) {
        onSuccess(data);
      } else if (isOfflineQueuedPayload(data)) {
        toast.success(crudMessages.offlineQueuedUpdate, {
          description: crudMessages.offlineQueuedDescription,
        });
      } else {
        toast.success(crudMessages.updateSuccess);
      }
    },
    onMutate: (variables: { formData: T; id: string }) => {
      if (onMutate) {
        return onMutate(variables, {});
      }
    },
    onSettled: () => {
      queryInvalidationKeys?.forEach((key) => {
        queryClient.invalidateQueries({
          queryKey: [key],
        });
      });
    },
  });
}

export function useDelete<T>({
  route,
  queryInvalidationKeys,
  mutationKey,
  onSuccess,
  onError,
}: UseCustomMutationsProps<T>) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey,
    mutationFn: async ({ id }: { id: string }) => {
      const response = await api.delete(`${route}/${id}`);
      return response.data;
    },
    onSuccess: (data: any, variables) => {
      if (isOfflineQueuedPayload(data)) {
        updateOfflineQueryCaches(queryClient, queryInvalidationKeys, (payload) =>
          removeOfflineRecord(payload, variables.id),
        );
      }

      if (onSuccess) {
        onSuccess(data);
      } else if (isOfflineQueuedPayload(data)) {
        toast.success(crudMessages.offlineQueuedDelete, {
          description: crudMessages.offlineQueuedDescription,
        });
      } else {
        toast.success(crudMessages.deleteSuccess);
      }
    },
    onSettled: () => {
      queryInvalidationKeys?.forEach((key) => {
        queryClient.invalidateQueries({
          queryKey: [key],
        });
      });
    },
  });
}
