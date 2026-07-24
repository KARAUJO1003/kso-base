export interface IFormaPagamento {
  _id: string;
  codigo: string;
  nome: string;
  descricao: string;
  ativo: boolean;
  taxa: boolean;
  acrescimo_percentual: number;
  createdAt: string;
  updatedAt: string;
}
