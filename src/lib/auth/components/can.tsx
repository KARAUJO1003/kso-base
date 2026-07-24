"use client";
import React, { useMemo } from "react";
import { useAuthGuardContext } from "../hooks/use-auth-guard-context";
import { useAbilities } from "../hooks/use-abilities";
import { PermissionInput } from "../types/permissions";

export interface CanProps {
  /** Conteúdo a ser renderizado se o usuário tiver permissão */
  children: React.ReactNode;
  /** Lista de permissões necessárias: locais dentro de AuthGuard ou completas no modo standalone */
  can: PermissionInput[];
  /** Modo de validação: "all" requer todas as permissões, "any" requer apenas uma */
  mode?: "all" | "any";
  /** Conteúdo a ser renderizado quando o usuário não tiver permissão (null por padrão) */
  fallback?: React.ReactNode;
  /** [Modo standalone] Lista de abilities do usuário (quando usado fora do AuthGuard) */
  abilities?: string[];
  /** [Modo standalone] Se o usuário é admin (quando usado fora do AuthGuard) */
  isAdmin?: boolean;
  /** [Modo standalone] Slug usado quando `can` receber permissões locais */
  groupSlug?: string;
}

/**
 * Componente para proteção granular de UI baseado em permissões.
 *
 * **Modo recomendado (dentro de AuthGuard):**
 * Usa o contexto do AuthGuard pai para validar permissões. O `groupSlug` é herdado automaticamente.
 *
 * **Modo standalone (fora de AuthGuard):**
 * Use as props `abilities` e `isAdmin` para fornecer as permissões manualmente.
 *
 * @example Modo contexto (recomendado)
 * <AuthGuard groupSlug="usuarios" can={["ver"]}>
 *   <Can can={["criar"]}>
 *     <Button>Criar Usuário</Button>
 *   </Can>
 *   <Can can={["editar"]} fallback={<Tooltip>Sem permissão</Tooltip>}>
 *     <Button>Editar</Button>
 *   </Can>
 * </AuthGuard>
 *
 * @example Modo standalone (fora de AuthGuard)
 * const { user } = useAuth();
 * <Can can={["usuarios:criar"]} abilities={user?.abilities} isAdmin={user?.isAdmin}>
 *   <Button>Criar</Button>
 * </Can>
 *
 * @example Validação com "any" (pelo menos uma permissão)
 * <Can can={["editar", "excluir"]} mode="any">
 *   <Button>Ações</Button>
 * </Can>
 */
export function Can({
  children,
  can,
  mode = "all",
  fallback = null,
  abilities,
  isAdmin,
  groupSlug,
}: CanProps) {
  const context = useAuthGuardContext();

  // Modo standalone: use abilities/isAdmin fornecidas via props
  const standaloneAbilities = useAbilities(abilities ?? [], isAdmin, groupSlug);

  const hasAccess = useMemo(() => {
    // Modo contexto: use o contexto do AuthGuard pai
    if (context) {
      return mode === "all" ? context.canAll(can) : context.canAny(can);
    }

    // Modo standalone: use abilities fornecidas manualmente
    if (abilities !== undefined) {
      return mode === "all"
        ? standaloneAbilities.canAll(can)
        : standaloneAbilities.canAny(can);
    }

    // Nem contexto nem abilities fornecidas: avisar e falhar
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "[Can] Componente usado sem contexto AuthGuard e sem props 'abilities'. Renderizando null.",
        { can, mode },
      );
    }
    return false;
  }, [context, can, mode, abilities, standaloneAbilities]);

  if (!hasAccess) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
