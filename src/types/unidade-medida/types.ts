import { ILoja } from "../lojas/types";

export interface IUnidadeMedida {
  _id: string;
  codigo: string;
  loja: ILoja;
  nome: string;
  sigla: string;
  createdAt: string;
  updatedAt: string;
}
