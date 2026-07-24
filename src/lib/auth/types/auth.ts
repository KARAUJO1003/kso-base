import { PermissionInput } from "./permissions";

export interface IAuthUser {
  _id: string;
  email: string;
  avatar_url?: string;
  username: string;
  pagina_inicial?: string;
  status: string;
  isAdmin: boolean;
  abilities: string[];
}

export interface IAuthContext {
  user: IAuthUser | null;
  isLoading: boolean;
  isAdmin: boolean;
  can: (ability: PermissionInput) => boolean;
  canAny: (abilities: PermissionInput[]) => boolean;
  canAll: (abilities: PermissionInput[]) => boolean;
}
