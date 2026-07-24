import { IAuthUser } from "../types/auth";
import { AUTH_CONFIG } from "../config";
import { api } from "@/lib/axios-instance";
import { useCreate } from "@/hooks/use-crud";
import { useQuery } from "@tanstack/react-query";
import { DEMO_CONFIG } from "@/config/demo.config";

const AUTH_USER_QUERY_KEY = (grupoSlug?: string) =>
  ["auth", "me", grupoSlug] as const;

/**
 * Usuário sintético usado quando NEXT_PUBLIC_DISABLE_AUTH=true (deploy demo
 * sem backend). isAdmin:true libera todo o `Can`/`hasPermission` sem
 * precisar simular abilities por módulo. Ver src/config/demo.config.ts.
 */
const DEMO_USER: IAuthUser = {
  _id: "demo-user",
  email: "demo@kso.dev",
  username: "demo",
  status: "ATIVO",
  isAdmin: true,
  abilities: [],
};

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
    enabled: !DEMO_CONFIG.disableAuth,
  });

  const logoutMutation = useCreate({
    route: "/auth/logout",
    mutationKey: ["auth", "logout"] as const,
    config: {
      baseURL: AUTH_CONFIG.ssoBaseUrl,
    },
  });

  if (DEMO_CONFIG.disableAuth) {
    return {
      user: DEMO_USER,
      isLoading: false,
      error: null,
      refetch: query.refetch,
      logoutMutation,
    };
  }

  return {
    user: query.data ?? null,
    isLoading: query.isPending,
    error: query.error,
    refetch: query.refetch,
    logoutMutation,
  };
}
