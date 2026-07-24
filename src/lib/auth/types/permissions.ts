/**
 * Tipo type-safe para permissões no formato "grupo:permissao"
 * Ex: "usuarios:criar", "sistemas:editar", "sso:ver"
 */
export type Permission = `${string}:${string}`;
export type PermissionInput = Permission | string;
export type PermissionMode = "all" | "any";

export function normalizePermission(
  permission: PermissionInput,
  groupSlug?: string,
): Permission {
  if (permission.includes(":")) {
    return permission as Permission;
  }

  if (groupSlug) {
    return `${groupSlug}:${permission}` as Permission;
  }

  return permission as Permission;
}

export function normalizePermissions(
  permissions: PermissionInput[],
  groupSlug?: string,
): Permission[] {
  return permissions.map((permission) =>
    normalizePermission(permission, groupSlug),
  );
}

export function hasPermission(
  userAbilities: string[],
  permission: PermissionInput,
  groupSlug?: string,
  isAdmin?: boolean,
): boolean {
  if (isAdmin) return true;
  return userAbilities.includes(normalizePermission(permission, groupSlug));
}

export function hasPermissionsAll(
  userAbilities: string[],
  required: PermissionInput[],
  groupSlug?: string,
  isAdmin?: boolean,
): boolean {
  if (isAdmin) return true;
  if (required.length === 0) return true;
  const set = new Set(userAbilities);
  return normalizePermissions(required, groupSlug).every((p) => set.has(p));
}

export function hasPermissionsAny(
  userAbilities: string[],
  required: PermissionInput[],
  groupSlug?: string,
  isAdmin?: boolean,
): boolean {
  if (isAdmin) return true;
  if (required.length === 0) return true;
  const set = new Set(userAbilities);
  return normalizePermissions(required, groupSlug).some((p) => set.has(p));
}

export function hasRequiredPermissions(
  userAbilities: string[],
  required: PermissionInput[],
  options: {
    groupSlug?: string;
    mode?: PermissionMode;
    isAdmin?: boolean;
  } = {},
): boolean {
  return options.mode === "any"
    ? hasPermissionsAny(
        userAbilities,
        required,
        options.groupSlug,
        options.isAdmin,
      )
    : hasPermissionsAll(
        userAbilities,
        required,
        options.groupSlug,
        options.isAdmin,
      );
}
