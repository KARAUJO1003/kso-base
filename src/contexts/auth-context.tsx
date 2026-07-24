"use client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { parseCookies } from "nookies";
import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getFirstCookieValue,
  sessionCookieNames,
} from "@/config/session-config";
import { api } from "@/lib/axios-instance";
import { clearSession, getUser } from "@/lib/session/client";
import { clearCacheNavegador } from "@/lib/session/utils";

interface AuthContextType {
  user: User | null;
  signOut: () => void;
  handleSetUserAuth: (user: User) => void;
  isPending: boolean;
  token: string;
  isLogged: boolean;
}

interface User {
  _id: string;
  username: string;
  email: string;
  setor: string;
  isAdmin: boolean;
  permissions: string[];
  ability: string[];
  estrutura_rm: string | number | null;
  colaborador: {
    _id: string;
    nivel_hierarquico: string | null;
  };
}

export const getTestUser = async () => {
  const dataUser = await api.get("auth/me").then(async (response) => {
    return response.data;
  });

  return dataUser;
};

export const getAbilitiesUser = async () => {
  const { data } = await api.get("/auth/abilities");
  return data?.ability || [];
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  signOut: () => null,
  handleSetUserAuth: () => null,
  isPending: false,
  token: "",
  isLogged: false,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const tokenCookie = getFirstCookieValue(parseCookies(), sessionCookieNames.token);
  const router = useRouter();
  const queryClient = useQueryClient();
  const [user, setUser] = useState<User | null>(null);

  const { data: userAbilities, isPending: isAbilitiesPending } = useQuery({
    queryKey: ["userAbilities", tokenCookie],
    queryFn: getAbilitiesUser,
    enabled: !!tokenCookie,
    refetchOnWindowFocus: false,
  });

  const { data: userAuth, isPending: isUserAuthPending } = useQuery({
    queryKey: ["userAuth", tokenCookie],
    queryFn: getTestUser,
    enabled: !!tokenCookie,
    refetchOnWindowFocus: false,
  });

  const updateUserWithAbilities = (
    user: User | null,
    abilities: string[] = [],
  ) => {
    if (user) {
      return { ...user, ability: abilities };
    }
    return null;
  };

  useEffect(() => {
    const fetchUserSession = async () => {
      try {
        const userSession = await getUser();
        setUser(updateUserWithAbilities(userSession, userAbilities));
      } catch (error) {
        console.error("Failed to fetch user session:", error);
      }
    };

    if (userAuth) {
      setUser(updateUserWithAbilities(userAuth, userAbilities));
    }

    if (tokenCookie) {
      queryClient.invalidateQueries({ queryKey: ["userAuth"] });
      fetchUserSession();
    }
  }, [tokenCookie, userAbilities, userAuth]);

  const handleSetUserAuth = (user: User) => {
    setUser(updateUserWithAbilities(user, userAbilities));
  };

  const signOut = async () => {
    try {
      await clearSession();
      setUser(null);
      router.push("/login");
      clearCacheNavegador(false);
    } catch (error) {
      console.error("Failed to sign out:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user: userAuth || user,
        signOut,
        isPending: isUserAuthPending || isAbilitiesPending,
        token: tokenCookie,
        handleSetUserAuth,
        isLogged: !!tokenCookie,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
