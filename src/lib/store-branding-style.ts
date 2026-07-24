import { StoreBrandingTokens } from "./store-branding";

export interface StoreBrandingStyle {
  setProperty(name: string, value: string): void;
  removeProperty(name: string): string;
}

export function syncStoreBrandingTokens(
  style: StoreBrandingStyle,
  previousTokens: StoreBrandingTokens | null,
  nextTokens: StoreBrandingTokens | null,
) {
  Object.keys(previousTokens ?? {}).forEach((property) => {
    style.removeProperty(property);
  });

  Object.entries(nextTokens ?? {}).forEach(([property, value]) => {
    style.setProperty(property, value);
  });
}
