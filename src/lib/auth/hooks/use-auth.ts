"use client";
import { useRouter } from "next/navigation";
import { useAuthUser } from "./use-auth-user";
import { useAbilities } from "./use-abilities";
import { clearSession } from "@/lib/session/client";
import { useQueryClient } from "@tanstack/react-query";
import { offlineDb } from "@/lib/offline/db";

export function useAuth({ grupoSlug }: { grupoSlug?: string } = {}) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, isLoading, error, refetch, logoutMutation } = useAuthUser({
    grupoSlug,
  });
  const { can, canAny, canAll } = useAbilities(
    user?.abilities ?? [],
    user?.isAdmin,
    grupoSlug,
  );

  async function signOut() {
    await clearSession();
    await offlineDb.clearAll();
    localStorage.clear();
    sessionStorage.clear();
    queryClient.clear();
    router.replace("/login");
    router.refresh();
  }

  return {
    user,
    isLoading,
    isAdmin: user?.isAdmin ?? false,
    can,
    canAny,
    canAll,
    error,
    refetch,
    logoutMutation,
    isAuthenticated: user?._id ? true : false,
    signOut,
  };
}
