import { AUTH_CONFIG } from "./config";
import { proxyHandler } from "./proxy-handler";

export const ssoAuth = () => {
  return {
    proxyHandler,
    config: AUTH_CONFIG,
  };
};

export { AuthGuard } from "./components/auth-guard";
export type { AuthGuardProps } from "./components/auth-guard";
export { Can } from "./components/can";
export type { CanProps } from "./components/can";
export { AuthProvider } from "./providers/auth-provider";
export { useAuth } from "./hooks/use-auth";
export { useAuthUser } from "./hooks/use-auth-user";
export { useAbilities } from "./hooks/use-abilities";
export { useAuthGuardContext } from "./hooks/use-auth-guard-context";
export type { IAuthContext, IAuthUser } from "./types/auth";
export type {
  Permission,
  PermissionInput,
  PermissionMode,
} from "./types/permissions";
export {
  hasPermission,
  hasPermissionsAll,
  hasPermissionsAny,
  hasRequiredPermissions,
  normalizePermission,
  normalizePermissions,
} from "./types/permissions";
