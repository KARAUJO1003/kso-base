import { ILoja } from "../lojas/types";
import { IPessoa } from "../pessoas/types";

export enum EStatusFornecedor {
  ATIVO = 'ATIVO',
  INATIVO = 'INATIVO',
}

export interface IFornecedor {
  _id: string;
  codigo: string;
  pessoa?: IPessoa;
  nome: string;
  status: EStatusFornecedor;
  loja: ILoja;
  createdAt: string;
  updatedAt: string;
}
