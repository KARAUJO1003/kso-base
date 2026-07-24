"use client";
import React, { createContext, useEffect, useRef } from "react";
import { useAuthUser } from "../hooks/use-auth-user";
import { useAbilities } from "../hooks/use-abilities";
import { IAuthContext } from "../types/auth";
import { requestOfflineSync } from "@/lib/offline/utils";

const AuthContext = createContext<IAuthContext | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
  grupoSlug?: string; // Para casos onde o usuário pode ter diferentes permissões dependendo do grupo selecionado
}

export function AuthProvider({ children, grupoSlug }: AuthProviderProps) {
  const { user, isLoading } = useAuthUser({ grupoSlug });
  const lastSyncedUserId = useRef<string | undefined>(undefined);
  const { can, canAny, canAll } = useAbilities(
    user?.abilities ?? [],
    user?.isAdmin,
    grupoSlug,
  );

  useEffect(() => {
    if (!user?._id || lastSyncedUserId.current === user._id) return;

    lastSyncedUserId.current = user._id;
    requestOfflineSync("auth");
  }, [user?._id]);

  const value: IAuthContext = {
    user,
    isLoading,
    isAdmin: user?.isAdmin ?? false,
    can,
    canAny,
    canAll,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export { AuthContext };
