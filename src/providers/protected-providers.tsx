"use client";
import React from "react";
import { AbilityProvider } from "@/contexts/abilities";
import { StoreProvider } from "@/contexts/store-context";
import { AuthProvider } from "@/lib/auth/providers/auth-provider";
import { StoreBrandProvider } from "./store-brand-provider";

export function ProtectedProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <StoreProvider>
      <StoreBrandProvider>
        <AbilityProvider>
          <AuthProvider>{children}</AuthProvider>
        </AbilityProvider>
      </StoreBrandProvider>
    </StoreProvider>
  );
}
