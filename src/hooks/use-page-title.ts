"use client";

import { useEffect } from "react";
import { siteConfig } from "@/config/site-config";
import { useHeader } from "@/contexts/header-context";

export function usePageTitle(title: string) {
  const { setTitle } = useHeader();

  useEffect(() => {
    setTitle(title);
    // Cleanup: volta para o título padrão quando o componente desmonta
    return () => {
      setTitle(siteConfig.description);
    };
  }, [title, setTitle]);
}
