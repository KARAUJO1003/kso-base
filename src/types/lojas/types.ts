import { StoreBranding } from "../store-branding";

export interface ILoja {
  _id: string;
  pessoa: any;
  nome: string;
  tipo: TipoLoja;
  sigla: string;
  status: StatusLoja;
  loja_grupo: any;
  deposito_default: any;
  tabela_preco_default: any;
  updated_by: any;
  created_by: string;
  createdAt: string;
  updatedAt: string;
  codigo: string;
  branding?: StoreBranding;
}

export enum TipoLoja {
  MATRIZ = "Matriz",
  FILIAL = "Filial",
}

export enum StatusLoja {
  ATIVO = "ATIVO",
  INATIVO = "INATIVO",
}
