"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";

interface ProgressBarContextType {
  isLoading: boolean;
  progress: number;
}

const ProgressBarContext = createContext<ProgressBarContextType>({
  isLoading: false,
  progress: 0,
});

export const useProgressBar = () => useContext(ProgressBarContext);

interface ProgressBarProviderProps {
  children: ReactNode;
}

export function ProgressBarProvider({ children }: ProgressBarProviderProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [pendingPath, setPendingPath] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    let progressInterval: NodeJS.Timeout | undefined;
    let timeoutId: NodeJS.Timeout | undefined;

    const startProgress = (nextPath: string) => {
      setIsLoading(true);
      setProgress(0);
      setPendingPath(nextPath);

      progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + Math.random() * 15;
        });
      }, 100);
    };

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest("a");

      if (
        link &&
        link.href &&
        !link.href.startsWith("mailto:") &&
        !link.href.startsWith("tel:")
      ) {
        const url = new URL(link.href);
        const currentUrl = new URL(window.location.href);

        // Só inicia o progresso se for uma navegação interna diferente da página atual
        if (
          url.origin === currentUrl.origin &&
          url.pathname !== currentUrl.pathname
        ) {
          startProgress(url.pathname);
        }
      }
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
      if (progressInterval) clearInterval(progressInterval);
      if (timeoutId !== undefined) clearTimeout(timeoutId);
    };
  }, []);

  // Só finaliza o progresso quando a página de destino for montada
  useEffect(() => {
    if (isLoading && pendingPath && pathname === pendingPath) {
      setProgress(100);
      const timeout = setTimeout(() => {
        setIsLoading(false);
        setProgress(0);
        setPendingPath(null);
      }, 200);
      return () => clearTimeout(timeout);
    }
  }, [pathname, isLoading, pendingPath]);

  return (
    <ProgressBarContext.Provider value={{ isLoading, progress }}>
      {children}
    </ProgressBarContext.Provider>
  );
}
