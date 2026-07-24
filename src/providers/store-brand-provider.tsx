"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { useTheme } from "next-themes";

import { useStore } from "@/contexts/store-context";
import {
  getStoreBrandingTokens,
  StoreBrandingTokens,
} from "@/lib/store-branding";
import { syncStoreBrandingTokens } from "@/lib/store-branding-style";
import { StoreBranding } from "@/types/store-branding";
import { resolveAssetUrl } from "@/lib/asset-url";
import { siteConfig } from "@/config/site-config";

interface StoreBrandContextValue {
  branding?: StoreBranding;
  logoUrl?: string;
}

const StoreBrandContext = createContext<StoreBrandContextValue>({});

export function StoreBrandProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { selectedStore } = useStore();
  const { resolvedTheme } = useTheme();
  const previousTokens = useRef<StoreBrandingTokens | null>(null);
  const branding = selectedStore?.branding;
  const theme = resolvedTheme === "dark" ? "dark" : "light";

  useEffect(() => {
    const nextTokens = getStoreBrandingTokens(branding, theme);

    syncStoreBrandingTokens(
      document.documentElement.style,
      previousTokens.current,
      nextTokens,
    );
    previousTokens.current = nextTokens;
  }, [branding, theme]);

  useEffect(() => {
    return () => {
      syncStoreBrandingTokens(
        document.documentElement.style,
        previousTokens.current,
        null,
      );
    };
  }, []);

  const value = useMemo(
    () => ({
      branding,
      logoUrl: resolveAssetUrl(branding?.logo_url, siteConfig.baseUrlFiles),
    }),
    [branding],
  );

  return (
    <StoreBrandContext.Provider value={value}>
      {children}
    </StoreBrandContext.Provider>
  );
}

export function useStoreBranding() {
  return useContext(StoreBrandContext);
}
