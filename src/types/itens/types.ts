import { IGrupoIten } from "@/types/grupos-itens/types";
import { IUnidadeMedida } from "@/types/unidade-medida/types";
import { IDeposito } from "../deposito/types";
import { ILoja } from "../lojas/types";
import { ITabelasPrecos } from "../tabelas-precos/types";

export type ItenReference<T> = string | T | null | undefined;

export enum ETipoItem {
  SIMPLES = "simples",
  COMPOSTO = "composto",
}

export interface IItemEstoque {
  _id?: string;
  codigo?: string;
  item?: IIten;
  deposito?: IDeposito;
  posicao?: string;
  estoque?: number;
  disponivel?: number;
  reservado?: number;
  usado?: number;
  compra?: number;
  maximo?: number;
  minimo?: number;
  seguranca?: number;
  reabastecimento?: number;
}

export interface IItemPreco {
  _id?: string;
  codigo?: string;
  item?: string | IIten;
  tabela_preco?: ITabelasPrecos;
  compra?: number;
  custo?: number;
  custo_sugerido?: number;
  lucro_pretendido?: number;
  impostos?: number;
  taxas?: number;
  despesas_venda?: number;
  venda?: number;
  venda_vista?: number;
  venda_prazo?: number;
  acrescimo?: number;
}

export interface IIten {
  _id?: string;
  codigo?: string;
  codigo_barras?: string;
  nome?: string;
  descricao?: string;
  tipo_item?: ETipoItem;
  componentes?: Array<{
    item?: ItenReference<IIten>;
    quantidade?: number;
  }>;
  unidade_compra?: ItenReference<IUnidadeMedida>,
  unidade_venda?: ItenReference<IUnidadeMedida>,
  fornecedor?: ItenReference<{ _id: string; codigo?: string; nome: string }>,
  item_estoque?: IItemEstoque,
  item_preco?: IItemPreco,
  preco_resolvido?: IItemPreco,
  loja?: ItenReference<ILoja>,
  grupo_item?: IGrupoIten,
  sub_grupo_item?: IGrupoIten,
  deposito?: IDeposito;
  tabela_preco?: ITabelasPrecos;
  ncm?: string;
  vida_util_mes?: number;
  volume_venda?: number;
  volume_compra?: number;
  estoque_minimo?: number;
  estoque_maximo?: number;
  estoque_seguranca?: number;
  posicao?: string;
  preco_unitario?: number;
  validade?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}
