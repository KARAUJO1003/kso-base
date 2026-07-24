import { ICargo } from "../cargos/types";
import { ICentroCusto } from "../centros-custos/types";
import { IGerencia } from "../gerencia/types";
import { IPessoa } from "../pessoas/types";
import { ISetor } from "../setores/type";

export interface IColaborador {
  _id: string;
  codigo: string;
  pessoa: IPessoa;
  obs: string;
  ativo: string;
  gerencia: IGerencia;
  setor: ISetor;
  cargo: ICargo;
  centro_custo?: ICentroCusto;
  data_admissao: string;
  createdAt: string;
  updatedAt: string;
}

export interface IColaboradorImportRow {
  pessoa: string;
  obs?: string;
  ativo?: string;
  gerencia: string;
  setor: string;
  cargo: string;
  centro_custo: string;
  data_admissao: string;
  senha?: string;
}
