export interface IPermissions {
  _id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  roles?: any[];
  permissao_grupos?: any[];
}
