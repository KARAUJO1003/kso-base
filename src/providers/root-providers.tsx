"use client";
import React from "react";
import { ThemeProvider } from "./theme-provider";
import { ProgressBarProvider } from "@/contexts/progress-bar-context";
import { ProgressBar } from "@/components/progress-bar";
import { ModalProvider } from "./modal-provider";
import { HeaderProvider } from "@/contexts/header-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "sonner";
import { SocketProvider } from "./socket-provider";

const queryClient = new QueryClient();
export function RootProviders({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <SocketProvider>
          <HeaderProvider>
            <ModalProvider>
              <ProgressBarProvider>
                <ProgressBar />
                {children}
              </ProgressBarProvider>
            </ModalProvider>
          </HeaderProvider>
        </SocketProvider>
      </ThemeProvider>
      <ReactQueryDevtools
        initialIsOpen={process.env.APP_ENV === "development"}
      />
      <Toaster richColors visibleToasts={3} expand={true} />
    </QueryClientProvider>
  );
}
