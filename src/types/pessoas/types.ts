export interface IPessoa {
  _id?: string;
  id_seq?: number;
  tipo?: "FISICA" | "JURIDICA" | "ESTRANGEIRA" | "GOVERNO";
  nome?: string;
  apelido?: string;
  cpf_cnpj?: string;
  estado_civil?:
    | "SOLTEIRO"
    | "CASADO"
    | "DIVORCIADO"
    | "VIUVO"
    | "SEPARADO"
    | "UNIAO_ESTAVEL"
    | null;
  conjuge?: {
    value?: string;
    label?: string;
  } | null;
  casa_propria?: boolean;
  valor_aluguel?: number;
  escolaridade?: string;
  banco?: string;
  profissao?: {
    _id?: string;
    nome?: string;
    codigo?: string;
  };
  pcd?: boolean;
  sexo?: string;
  razao_social?: string;
  nome_fantasia?: string;
  inscricao_estadual?: string;
  inscricao_municipal?: string;
  regime_tributario?: string;
  cnae?: string;
  contatos_pessoa?: {
    _id?: string;
    id_seq?: number;
    nome?: string;
    setor?: string;
    email?: string;
    telefone?: string;
    celular?: string;
    isPrincipal?: boolean;
  }[];
  enderecos_pessoa?: {
    _id?: string;
    id_seq?: number;
    identificacao?: string;
    cep?: string;
    logradouro?: string;
    numero?: string;
    complemento?: string;
    bairro?: string;
    cidade?: string;
    estado?: string;
    isPrincipal?: boolean;
  }[];
  createdAt?: string;
  updatedAt?: string;
}
