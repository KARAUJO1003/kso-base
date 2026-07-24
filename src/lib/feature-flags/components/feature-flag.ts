import type { ReactNode } from "react";
import { FlagKeyType, isEnabled } from "@/lib/feature-flags/feature-flag";

type FeatureProps = {
  flag: FlagKeyType;
  children: ReactNode;
  fallback?: ReactNode;
  defaultValue?: boolean;
};

export function Feature({
  flag,
  children,
  fallback = null,
  defaultValue = false,
}: FeatureProps) {
  return isEnabled(flag, defaultValue) ? children : fallback;
}
