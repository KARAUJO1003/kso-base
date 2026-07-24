import { IGrupoIten } from "@/types/grupos-itens/types";
import { IUnidadeMedida } from "@/types/unidade-medida/types";

export type ItemReference<T> = string | T | null | undefined;
export enum EStatusItem {
  ATIVO = 'ativo',
  INATIVO = 'inativo',
  SUSPENSO = 'suspenso',
}
export interface IItem {
  _id: string;
  nome: string;
  status: EStatusItem;
  descricao?: string;
  grupo_item?: ItemReference<IGrupoIten>;
  unidade_compra?: ItemReference<IUnidadeMedida>;
  unidade_venda?: ItemReference<IUnidadeMedida>;
  createdAt: string;
  updatedAt: string;
}
