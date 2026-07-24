import { StoreBranding } from "@/types/store-branding";

export type StoreBrandingTheme = "light" | "dark";
export type StoreBrandingTokens = Record<`--${string}`, string>;

const DEFAULT_BRANDING = {
  primary: "#D8142A",
  secondary: "#FDE8EC",
  contrast: "#FFFFFF",
} as const;

type RGB = {
  red: number;
  green: number;
  blue: number;
};

export function normalizeHexColor(value?: string | null) {
  if (!value) return null;

  const normalized = value.trim().toUpperCase();

  if (/^#[0-9A-F]{6}$/.test(normalized)) return normalized;

  if (/^#[0-9A-F]{3}$/.test(normalized)) {
    return `#${normalized
      .slice(1)
      .split("")
      .map((character) => `${character}${character}`)
      .join("")}`;
  }

  return null;
}

function hexToRgb(hex: string): RGB {
  return {
    red: Number.parseInt(hex.slice(1, 3), 16),
    green: Number.parseInt(hex.slice(3, 5), 16),
    blue: Number.parseInt(hex.slice(5, 7), 16),
  };
}

function rgbToHex({ red, green, blue }: RGB) {
  return `#${[red, green, blue]
    .map((channel) =>
      Math.max(0, Math.min(255, channel))
        .toString(16)
        .padStart(2, "0"),
    )
    .join("")
    .toUpperCase()}`;
}

function mixColors(source: string, target: string, targetWeight: number) {
  const sourceRgb = hexToRgb(source);
  const targetRgb = hexToRgb(target);
  const sourceWeight = 1 - targetWeight;

  return rgbToHex({
    red: Math.round(
      sourceRgb.red * sourceWeight + targetRgb.red * targetWeight,
    ),
    green: Math.round(
      sourceRgb.green * sourceWeight + targetRgb.green * targetWeight,
    ),
    blue: Math.round(
      sourceRgb.blue * sourceWeight + targetRgb.blue * targetWeight,
    ),
  });
}

function getReadableForeground(background: string) {
  const { red, green, blue } = hexToRgb(background);
  const luminance = (red * 299 + green * 587 + blue * 114) / 1000;

  return luminance >= 150 ? "#12090D" : "#FFFFFF";
}

export function getStoreBrandingTokens(
  branding: StoreBranding | undefined,
  theme: StoreBrandingTheme,
): StoreBrandingTokens | null {
  if (!branding) return null;

  const primary =
    normalizeHexColor(branding.cor_primaria) ?? DEFAULT_BRANDING.primary;
  const secondary =
    normalizeHexColor(branding.cor_secundaria) ?? DEFAULT_BRANDING.secondary;
  const contrast =
    normalizeHexColor(branding.cor_contraste) ?? DEFAULT_BRANDING.contrast;

  const isDark = theme === "dark";
  const effectivePrimary = isDark
    ? mixColors(primary, "#FFFFFF", 0.2)
    : primary;
  const background = isDark
    ? mixColors(primary, "#000000", 0.88)
    : mixColors(primary, "#FFFFFF", 0.97);
  const surface = isDark
    ? mixColors(primary, "#000000", 0.82)
    : "#FFFFFF";
  const muted = isDark
    ? mixColors(primary, "#000000", 0.72)
    : mixColors(secondary, "#FFFFFF", 0.45);
  const accent = isDark
    ? mixColors(primary, "#000000", 0.62)
    : mixColors(secondary, primary, 0.18);
  const border = isDark
    ? mixColors(primary, "#FFFFFF", 0.08)
    : mixColors(secondary, "#12090D", 0.12);
  const foreground = getReadableForeground(background);
  const secondaryForeground = getReadableForeground(secondary);
  const chartSecondary = mixColors(secondary, primary, isDark ? 0.55 : 0.45);

  return {
    "--primary": effectivePrimary,
    "--primary-foreground": contrast,
    "--ring": effectivePrimary,
    "--background": background,
    "--foreground": foreground,
    "--card": surface,
    "--card-foreground": foreground,
    "--popover": surface,
    "--popover-foreground": foreground,
    "--secondary": secondary,
    "--secondary-foreground": secondaryForeground,
    "--muted": muted,
    "--muted-foreground": mixColors(foreground, background, 0.42),
    "--accent": accent,
    "--accent-foreground": getReadableForeground(accent),
    "--border": border,
    "--input": mixColors(border, foreground, 0.08),
    "--sidebar": surface,
    "--sidebar-foreground": foreground,
    "--sidebar-primary": effectivePrimary,
    "--sidebar-primary-foreground": contrast,
    "--sidebar-accent": accent,
    "--sidebar-accent-foreground": getReadableForeground(accent),
    "--sidebar-border": border,
    "--sidebar-ring": effectivePrimary,
    "--brand-default": effectivePrimary,
    "--brand-link": mixColors(
      effectivePrimary,
      isDark ? "#FFFFFF" : "#000000",
      0.16,
    ),
    "--brand-600": mixColors(effectivePrimary, "#000000", 0.24),
    "--brand-500": mixColors(effectivePrimary, "#000000", 0.14),
    "--brand-400": mixColors(effectivePrimary, "#FFFFFF", 0.24),
    "--brand-300": mixColors(effectivePrimary, "#FFFFFF", 0.55),
    "--brand-200": mixColors(effectivePrimary, "#FFFFFF", 0.82),
    "--chart-1": effectivePrimary,
    "--chart-2": chartSecondary,
    "--chart-3": mixColors(effectivePrimary, secondary, 0.3),
    "--chart-4": mixColors(effectivePrimary, "#FFFFFF", 0.38),
    "--chart-5": mixColors(
      chartSecondary,
      isDark ? "#000000" : "#FFFFFF",
      0.28,
    ),
    "--chart-line-primary": effectivePrimary,
    "--chart-line-secondary": chartSecondary,
    "--chart-crosshair": effectivePrimary,
  };
}
