"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { AuthStore, StoreContextType, UpdateStorePayload } from "@/types/store";
import { useFetch, useUpdate } from "@/hooks/use-crud";
import { useQueryClient } from "@tanstack/react-query";
import { parseCookies } from "nookies";
import {
  getFirstCookieValue,
  sessionConfig,
  sessionCookieNames,
} from "@/config/session-config";
import { requestOfflineSync } from "@/lib/offline/utils";

const QUERY_KEY = ["auth-lojas"];
const MUTATION_KEY = ["update-user-store"];
export const StoreContext = createContext<StoreContextType>({
  selectedStore: null,
  stores: [],
  isLoading: false,
  isError: false,
  error: null,
  isUpdating: false,
  QUERY_KEY: [],
  refetch: () => { },
});

export const StoreProvider = ({ children }: { children: React.ReactNode }) => {
  const queryClient = useQueryClient();
  const [isMounted, setIsMounted] = useState(false);
  const token = isMounted
    ? getFirstCookieValue(parseCookies(), sessionCookieNames.token)
    : "";

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const {
    data: stores = [],
    isLoading: isStoresLoading,
    isError,
    error,
    refetch,
  } = useFetch<AuthStore[]>({
    route: "/auth/lojas",
    queryKey: [...QUERY_KEY, token],
    enabled: isMounted && !!token,
    meta: {
      rawResponse: true,
    },
  });

  const onUpdateStoreMutation = useUpdate<UpdateStorePayload>({
    route: "/users",
    mutationKey: MUTATION_KEY,
    onMutate: async ({ formData, id }) => {
      await queryClient.invalidateQueries();
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries();
      requestOfflineSync("store-change");
    },
    onError: async (error) => {
      await queryClient.invalidateQueries();
    },
  });

  function getSelectedStore() {
    if (!stores) return null;
    return stores.find((store) => store.selected) || null;
  }

  const selectedStore = getSelectedStore();

  useEffect(() => {
    if (!isMounted) return;

    if (selectedStore?._id) {
      localStorage.setItem(sessionConfig.SELECTED_STORE, selectedStore._id);
      return;
    }

    localStorage.removeItem(sessionConfig.SELECTED_STORE);
  }, [isMounted, selectedStore?._id]);

  return (
    <StoreContext.Provider
      value={{
        QUERY_KEY,
        selectedStore,
        onUpdateStoreMutation,
        isLoading: !isMounted || isStoresLoading,
        isError,
        error,
        isUpdating: onUpdateStoreMutation.isPending,
        stores,
        refetch,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
};
