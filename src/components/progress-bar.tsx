"use client";

import { useProgressBar } from "@/contexts/progress-bar-context";

export function ProgressBar() {
  const { isLoading, progress } = useProgressBar();

  if (!isLoading) return null;

  return (
    <div className="top-0 right-0 left-0 z-50 fixed">
      <div
        className="bg-gradient-to-r from-primary via-emerald-500 to-yellow-500 h-1 transition-all duration-300 ease-out"
        style={{
          width: `${progress}%`,
          boxShadow: "0 0 10px rgba(59, 130, 246, 0.5)",
        }}
      />
    </div>
  );
}
