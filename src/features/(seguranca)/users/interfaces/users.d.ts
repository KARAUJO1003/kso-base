export interface IUsers {
  _id?: string;
  username: string;
  email: string;
  nome?: string;
  apelido?: string;
  password?: string;
  loja?: any;
  role?: any;
  profiles?: IUserProfile[];
  permissaos?: any[];
  avatar_url?: string;
  setor?: string;
  pagina_inicial?: string;
  status?: "ATIVO" | "INATIVO" | "BLOQUEADO";
  tempo_expiracao_token?: string;
  lojas_associadas?: any[];
}

export interface IUserPermissionGroup {
  grupo: any;
  permissoes: any[];
}

export interface IUserProfile {
  sistema: any;
  pagina_inicial?: string;
  tempo_expiracao_token?: string;
  permissoes_grupos?: IUserPermissionGroup[];
}
