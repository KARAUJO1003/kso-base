export interface IRoles {
  _id: string;
  name: string;
  permissoes_grupos?: {
    grupo: any;
    permissoes: any[];
  }[];
  createdAt: string;
  updatedAt: string;
}
