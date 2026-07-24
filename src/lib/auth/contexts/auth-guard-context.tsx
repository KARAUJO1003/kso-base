"use client";
import { createContext } from "react";
import { IAuthUser } from "../types/auth";

/**
 * Contexto fornecido pelo AuthGuard para componentes filhos.
 * Permite validação de permissões sem novas requisições HTTP.
 */
export interface IAuthGuardContext {
  /** Slug do grupo de permissões (ex: "usuarios", "admin") */
  groupSlug?: string;
  /** Usuário autenticado (null se não autenticado) */
  user: IAuthUser | null;
  /** Estado de carregamento */
  isLoading: boolean;
  /**
   * Verifica se o usuário tem uma permissão específica.
   * Auto-detecta formato: se contém ":", usa como está; senão, concatena groupSlug.
   * @param ability - "criar" ou "usuarios:criar"
   */
  can: (ability: string) => boolean;
  /**
   * Verifica se o usuário tem QUALQUER uma das permissões.
   * Auto-detecta formato: se contém ":", usa como está; senão, concatena groupSlug.
   * @param abilities - ["criar", "editar"] ou ["usuarios:criar", "usuarios:editar"]
   */
  canAny: (abilities: string[]) => boolean;
  /**
   * Verifica se o usuário tem TODAS as permissões.
   * Auto-detecta formato: se contém ":", usa como está; senão, concatena groupSlug.
   * @param abilities - ["criar", "editar"] ou ["usuarios:criar", "usuarios:editar"]
   */
  canAll: (abilities: string[]) => boolean;
}

export const AuthGuardContext = createContext<IAuthGuardContext | undefined>(
  undefined,
);
