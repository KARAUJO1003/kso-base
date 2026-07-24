import { FEATURE_FLAGS } from "@/lib/feature-flags/flags.config";
import { BooleanDotPath } from "@/lib/feature-flags/types/feature-flags";

function getByDotPath(obj: any, key: string): unknown {
  return key
    .split(".")
    .reduce((acc, part) => (acc ? acc[part] : undefined), obj);
}

// Só aceita caminhos que apontam para boolean no objeto flags
export function isEnabled<K extends BooleanDotPath<typeof FEATURE_FLAGS>>(
  key: K,
  defaultValue = false,
): boolean {
  const v = getByDotPath(FEATURE_FLAGS, key as string);
  return typeof v === "boolean" ? v : defaultValue;
}

export type FlagKeyType = BooleanDotPath<typeof FEATURE_FLAGS>;

export const siteFlags = () => ({
  isEnabled,
});
