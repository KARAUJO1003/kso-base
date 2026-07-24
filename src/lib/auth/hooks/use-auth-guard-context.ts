"use client";
import { useContext } from "react";
import { AuthGuardContext } from "../contexts/auth-guard-context";

/**
 * Hook para acessar o contexto do AuthGuard.
 * Retorna undefined se não estiver dentro de um AuthGuard.
 *
 * @example
 * const context = useAuthGuardContext();
 * if (context) {
 *   const hasPermission = context.can("usuarios:criar");
 * }
 */
export function useAuthGuardContext() {
  return useContext(AuthGuardContext);
}
