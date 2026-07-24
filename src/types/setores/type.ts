import { ILoja } from "../lojas/types";

export interface ISetor {
  _id?: string;
  loja?: ILoja;
  codigo?: string;
  nome?: string;
  descricao?: string;
  createdAt?: string;
  updatedAt?: string;
}
