"use client";

import { useRef, useState } from "react";
import { CheckIcon, CopyIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function PreBlock({ className, children, ...props }: React.ComponentProps<"pre">) {
  const ref = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    const text = ref.current?.textContent ?? "";
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="group relative my-4">
      <pre
        ref={ref}
        className={cn(
          "overflow-x-auto rounded-lg border bg-[#0d1117] p-4 text-sm leading-relaxed dark:bg-[#0d1117]",
          className,
        )}
        {...props}
      >
        {children}
      </pre>
      <button
        type="button"
        onClick={handleCopy}
        aria-label="Copiar código"
        className="absolute right-2.5 top-2.5 rounded-md border border-white/10 bg-white/5 p-1.5 text-neutral-400 opacity-0 transition-opacity hover:text-neutral-100 group-hover:opacity-100"
      >
        {copied ? <CheckIcon className="size-3.5" /> : <CopyIcon className="size-3.5" />}
      </button>
    </div>
  );
}
