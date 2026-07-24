export interface ITabelasPrecos {
  _id: string;
  codigo: string;
  nome: string;
  ativo: EStatusTabelaPreco;
  data_validade: string;
  createdAt: string;
  updatedAt: string;
}

export enum EStatusTabelaPreco {
  ATIVO = 'ATIVO',
  INATIVO = 'INATIVO',
}