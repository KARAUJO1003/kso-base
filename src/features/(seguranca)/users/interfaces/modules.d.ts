export interface IModules {
  _id: string;
  name: string;
  slug?: string;
  sistema?: any;
  permissoes?: any[];
  createdAt: string;
  updatedAt: string;
}

export interface ISystem {
  _id: string;
  codigo?: number;
  name: string;
  image?: string;
  description?: string;
  url?: string;
  createdAt?: string;
  updatedAt?: string;
}
