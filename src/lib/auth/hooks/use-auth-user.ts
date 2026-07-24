import { IAuthUser } from "../types/auth";
import { AUTH_CONFIG } from "../config";
import { api } from "@/lib/axios-instance";
import { useCreate } from "@/hooks/use-crud";
import { useQuery } from "@tanstack/react-query";

const AUTH_USER_QUERY_KEY = (grupoSlug?: string) =>
  ["auth", "me", grupoSlug] as const;

async function fetchAuthUser(grupoSlug?: string): Promise<IAuthUser> {
  const { data } = await api.get<IAuthUser>("/auth/me", {
    params: {
      grupo_slug: grupoSlug,
    },
  });
  return data;
}

export function useAuthUser({ grupoSlug }: { grupoSlug?: string } = {}) {
  const query = useQuery<IAuthUser>({
    queryKey: AUTH_USER_QUERY_KEY(grupoSlug),
    queryFn: () => fetchAuthUser(grupoSlug),
    // staleTime: 5 * 60 * 1000,
    retry: false,
  });

  const logoutMutation = useCreate({
    route: "/auth/logout",
    mutationKey: ["auth", "logout"] as const,
    config: {
      baseURL: AUTH_CONFIG.ssoBaseUrl,
    },
  });

  return {
    user: query.data ?? null,
    isLoading: query.isPending,
    error: query.error,
    refetch: query.refetch,
    logoutMutation,
  };
}
