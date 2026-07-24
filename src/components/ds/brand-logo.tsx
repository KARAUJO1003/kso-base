"use client";

import * as React from "react";

import { useStoreBranding } from "@/providers/store-brand-provider";
import { brandConfig } from "@/config/brand.config";
import { cn } from "@/lib/utils";

export type BrandLogoProps = React.ComponentProps<"svg"> & {
  variant?: "full" | "symbol";
  tone?: "default" | "inverse";
  logoUrl?: string;
};

function BrandSymbol() {
  return (
    <>
      <circle cx="76" cy="27" r="19" />
      <circle cx="189" cy="50" r="20" />
      <path d="M17 79c19-33 58-41 88-19l17 12-25 29-17-12c-12-9-28-6-37 6-9 13-6 30 7 39 15 10 34 7 45-7l49-63c18-23 51-28 75-11l-25 32c-7-5-17-4-23 3l-49 63c-24 31-68 38-100 16C-7 145-15 111 17 79Z" />
      <path d="m118 95 25-31 59 42c25 18 30 52 12 77l-32-23c5-7 3-17-4-22l-60-43Z" />
    </>
  );
}

export function BrandLogo({
  variant = "full",
  tone = "default",
  logoUrl,
  className,
  "aria-label": ariaLabel,
  ...props
}: BrandLogoProps) {
  const { logoUrl: storeLogoUrl } = useStoreBranding();
  const remoteLogoUrl = logoUrl?.trim() || storeLogoUrl;
  const [remoteLogoFailed, setRemoteLogoFailed] = React.useState(false);
  const isFull = variant === "full";
  const titleId = React.useId();
  const [wordmarkLine1, ...wordmarkRest] = brandConfig.name.split(" ");
  const wordmarkLine2 = wordmarkRest.join(" ");

  React.useEffect(() => {
    setRemoteLogoFailed(false);
  }, [remoteLogoUrl]);

  if (remoteLogoUrl && !remoteLogoFailed) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={remoteLogoUrl}
        alt={ariaLabel || "Logo da loja"}
        className={cn("shrink-0 object-contain", className)}
        onError={() => setRemoteLogoFailed(true)}
        data-brand-logo="store"
      />
    );
  }

  return (
    <svg
      viewBox={isFull ? "0 0 980 260" : "0 0 240 200"}
      role={ariaLabel ? "img" : undefined}
      aria-labelledby={ariaLabel ? titleId : undefined}
      aria-hidden={ariaLabel ? undefined : true}
      className={cn(
        "shrink-0",
        {
          "text-brand-default": tone === "default",
          "text-white": tone === "inverse",
        },
        className,
      )}
      data-brand-logo="default"
      {...props}
    >
      {ariaLabel ? <title id={titleId}>{ariaLabel}</title> : null}
      <g
        fill="currentColor"
        transform={isFull ? "translate(10 18) scale(1.08)" : undefined}
      >
        <BrandSymbol />
      </g>
      {isFull ? (
        <g fill={tone === "inverse" ? "currentColor" : "var(--foreground)"}>
          <text
            x="270"
            y="145"
            fontFamily="Arial, Helvetica, sans-serif"
            fontSize="118"
            fontWeight="300"
            letterSpacing="-5"
          >
            {wordmarkLine1.toUpperCase()}
          </text>
          {wordmarkLine2 ? (
            <text
              x="270"
              y="220"
              fontFamily="Arial, Helvetica, sans-serif"
              fontSize="61"
              fontWeight="300"
              letterSpacing="8"
            >
              {wordmarkLine2.toUpperCase()}
            </text>
          ) : null}
        </g>
      ) : null}
    </svg>
  );
}
