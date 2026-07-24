"use client";
import React, { useMemo } from "react";
import { forbidden, unauthorized } from "next/navigation";
import { useAuth } from "../hooks/use-auth";
import { AuthGuardContext } from "../contexts/auth-guard-context";
import { PermissionInput } from "../types/permissions";
import { IconLoader } from "@tabler/icons-react";

export interface AuthGuardProps {
  children: React.ReactNode;
  can: PermissionInput[];
  groupSlug?: string; // Ex: "admin", "financeiro"; permite usar "criar" em vez de "usuarios:criar"
  mode?: "all" | "any";
  fallback?: React.ReactNode;
  loading?: React.ReactNode;
  redirectWhenUnauthorized?: boolean; // Padrão: true (lança 401)
  redirectWhenForbidden?: boolean; // Padrão: true (lança 403)
}

/**
 * Protege conteúdo por permissões.
 *
 * - Sem usuário → `unauthorized()` (401), exceto quando houver `fallback`
 * - Sem permissão → `forbidden()` (403), exceto quando houver `fallback`
 * - Com `fallback` → renderiza fallback ao invés de lançar erro
 *
 * @example Protege rota (sem fallback → lança erro)
 * <AuthGuard groupSlug="usuarios" can={["ver"]}>
 *   {children}
 * </AuthGuard>
 *
 * @example Condicional (com fallback → esconde conteúdo)
 * <AuthGuard groupSlug="usuarios" can={["criar"]} fallback={null}>
 *   <BotaoCriar />
 * </AuthGuard>
 */
export function AuthGuard({
  children,
  groupSlug,
  can,
  mode = "all",
  fallback,
  redirectWhenUnauthorized = true,
  redirectWhenForbidden = true,
  loading = <AuthGuardLoader />,
}: AuthGuardProps) {
  const {
    user,
    isLoading,
    can: canFn,
    canAny,
    canAll,
  } = useAuth({
    grupoSlug: groupSlug,
  });

  const hasAccess = useMemo(() => {
    if (!can || can.length === 0) return true;
    return mode === "all" ? canAll(can) : canAny(can);
  }, [can, mode, canAll, canAny]);

  // Valor do contexto para componentes filhos (Can)
  const contextValue = useMemo(
    () => ({
      groupSlug,
      user,
      isLoading,
      can: canFn,
      canAny,
      canAll,
    }),
    [groupSlug, user, isLoading, canFn, canAny, canAll],
  );

  if (isLoading) return <>{loading}</>;

  if (!user) {
    if (fallback !== undefined) return <>{fallback}</>;
    if (redirectWhenUnauthorized) {
      unauthorized();
    }
    return null;
  }

  if (!hasAccess) {
    if (fallback !== undefined) return <>{fallback}</>;
    if (redirectWhenForbidden) {
      forbidden();
    }
    return null;
  }

  return (
    <AuthGuardContext.Provider value={contextValue}>
      {children}
    </AuthGuardContext.Provider>
  );
}

const AuthGuardLoader = () => {
  return (
    <div className="flex flex-1 justify-center items-center">
      <IconLoader className="animate-spin" />
    </div>
  );
};
