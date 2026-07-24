"use client";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useAuth } from "./auth-context";
import { getUser } from "@/lib/session/client";

interface UserContextType {
  can: (
    permission: string,
    isIncluirString?: boolean,
    customCheck?: (abilities: string[]) => boolean
  ) => boolean;
  isLoading: boolean;
  canTabDefault: (
    tabs: string[],
    isIncluirString?: boolean,
    customCheck?: (abilities: string[]) => boolean
  ) => string;
  abilities: string[];
}

interface IUser {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  ability: string[];
}

const AbilityContext = createContext<UserContextType>({
  can: () => false,
  isLoading: true,
  canTabDefault: () => "",
  abilities: [],
});

export const AbilityProvider = ({ children }: { children: ReactNode }) => {
  const [userAuth, setUserAuth] = useState<IUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [abilities, setAbilities] = useState<string[]>([]);

  const { user, isLogged } = useAuth();
  const fetchUser = async () => {
    setIsLoading(true);
    setUserAuth(null);
    const useCookies = await getUser();
    if (useCookies) {
      setUserAuth({ ...useCookies, ability: user?.ability || [] });
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (!isLogged) {
      setAbilities([]);
      setUserAuth(null);
      setIsLoading(false);
      return;
    }
    fetchUser();
    if (user) {
      setAbilities(user?.ability || []);
    }
  }, [user, isLogged]);

  const can = (
    permission: string,
    isIncluirString: boolean = false,
    customCheck?: (abilities: string[]) => boolean
  ) => {
    const userCan = user || userAuth;
    if (!userCan) return false;
    if (userCan.isAdmin) return true;

    const hasPermission = isIncluirString
      ? userCan?.ability?.some((ab) => ab.includes(permission)) || false
      : abilities?.includes(permission) || false;

    // Se houver uma lógica personalizada, executa ela
    if (customCheck) {
      return hasPermission && customCheck(userCan.ability);
    }

    return hasPermission;
  };

  const canTabDefault = (
    tabs: string[],
    isIncluirString: boolean = false,
    customCheck?: (abilities: string[]) => boolean
  ): string => {
    const tab =
      tabs.find((tab) => can(tab, isIncluirString, customCheck)) || "";
    if (!tab) return "";
    return tab;
  };

  return (
    <AbilityContext.Provider
      value={{ can, isLoading, canTabDefault, abilities }}
    >
      {children}
    </AbilityContext.Provider>
  );
};

export const useAbility = () => {
  const context = useContext(AbilityContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
