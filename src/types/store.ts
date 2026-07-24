import { LucideIcon } from "lucide-react";
import { UseMutationResult } from "@tanstack/react-query";
import { StoreBranding } from "./store-branding";

export interface Store {
  _id: string;
  name: string;
  logo?: React.ElementType | LucideIcon;
  plan?: string;
  active?: boolean;
}

export interface AuthStore {
  _id: string;
  codigo: string;
  nome: string;
  deposito_default: any;
  tabela_preco_default: any;
  selected: boolean;
  branding?: StoreBranding;
}

export interface StoreContextType {
  selectedStore: AuthStore | null;
  stores: AuthStore[] | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  isUpdating: boolean;
  QUERY_KEY: string[];
  refetch: () => void;
  onUpdateStoreMutation?: UseMutationResult<
    UpdateStorePayload,
    Error,
    {
      formData: UpdateStorePayload;
      id: string;
    },
    void
  >;
}

export interface UpdateStorePayload {
  loja: string;
}
