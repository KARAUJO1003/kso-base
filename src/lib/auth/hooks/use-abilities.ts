"use client";
import { useMemo, useCallback } from "react";
import {
  hasPermissionsAll,
  hasPermissionsAny,
  hasPermission,
  PermissionInput,
} from "@/lib/auth/types/permissions";

export function useAbilities(
  abilities: string[],
  isAdmin?: boolean,
  groupSlug?: string,
) {
  const abilitySet = useMemo(() => new Set(abilities), [abilities]);
  const userAbilities = useMemo(() => Array.from(abilitySet), [abilitySet]);

  const can = useCallback(
    (ability: PermissionInput) => {
      return hasPermission(userAbilities, ability, groupSlug, isAdmin);
    },
    [groupSlug, isAdmin, userAbilities],
  );

  const canAny = useCallback(
    (required: PermissionInput[]) => {
      return hasPermissionsAny(userAbilities, required, groupSlug, isAdmin);
    },
    [groupSlug, isAdmin, userAbilities],
  );

  const canAll = useCallback(
    (required: PermissionInput[]) => {
      return hasPermissionsAll(userAbilities, required, groupSlug, isAdmin);
    },
    [groupSlug, isAdmin, userAbilities],
  );

  return { can, canAny, canAll };
}
