import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

export const featuredIconVariants = cva(
  "flex shrink-0 items-center justify-center border bg-muted [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='text-'])]:text-primary",
  {
    variants: {
      size: {
        xxs: "size-4 rounded-xs [&_svg]:size-2",
        xs: "size-6 rounded-sm [&_svg]:size-2",
        sm: "size-8 rounded-md [&_svg]:size-3",
        md: "size-12 rounded-lg [&_svg]:size-4",
        lg: "size-16 rounded-xl [&_svg]:size-6",
      },
      variant: {
        default: "",
        primary: "border-primary bg-primary text-primary-foreground",
        secondary: "border-secondary bg-secondary text-secondary-foreground",
        accent: "border-accent bg-accent text-accent-foreground",
        ghost: "border-transparent bg-transparent text-foreground/70",
      },
      rounded: {
        full: "rounded-full",
        xs: "rounded-xs",
        sm: "rounded-sm",
        md: "rounded-md",
        lg: "rounded-lg",
      },
    },
    defaultVariants: {
      size: "md",
      variant: "default",
      rounded: "md",
    },
  },
);

export function FeaturedIcon({
  size = "md",
  className,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof featuredIconVariants>) {
  return (
    <div
      data-slot="featured-icon"
      className={cn(
        featuredIconVariants({
          size,
          variant: props.variant,
          rounded: props.rounded,
        }),
        className,
      )}
      {...props}
    />
  );
}
