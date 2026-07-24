import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "group/badge inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-4xl border border-transparent px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground [a]:hover:bg-primary/80",
        secondary:
          "bg-secondary text-secondary-foreground [a]:hover:bg-secondary/80",
        destructive:
          "bg-destructive/10 text-destructive focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:focus-visible:ring-destructive/40 [a]:hover:bg-destructive/20",
        outline:
          "border-border text-foreground [a]:hover:bg-muted [a]:hover:text-muted-foreground",
        ghost:
          "hover:bg-muted hover:text-muted-foreground dark:hover:bg-muted/50",
        link: "text-primary underline-offset-4 hover:underline",

        notionDefault:
          "border-transparent bg-[#FFFFFF] text-[#373530] dark:bg-[#191919] dark:text-[#D4D4D4]",
        notionGray:
          "border-transparent bg-[#F1F1EF] text-[#787774] dark:bg-[#252525] dark:text-[#9B9B9B]",
        notionBrown:
          "border-transparent bg-[#F3EEEE] text-[#976D57] dark:bg-[#2E2724] dark:text-[#A27763]",
        notionOrange:
          "border-transparent bg-[#F8ECDF] text-[#CC782F] dark:bg-[#36291F] dark:text-[#CB7B37]",
        notionYellow:
          "border-transparent bg-[#FAF3DD] text-[#C29343] dark:bg-[#372E20] dark:text-[#C19138]",
        notionGreen:
          "border-transparent bg-[#EEF3ED] text-[#548164] dark:bg-[#242B26] dark:text-[#4F9768]",
        notionBlue:
          "border-transparent bg-[#E9F3F7] text-[#487CA5] dark:bg-[#1F282D] dark:text-[#447ACB]",
        notionPurple:
          "border-transparent bg-[#F6F3F8] text-[#8A67AB] dark:bg-[#2A2430] dark:text-[#865DBB]",
        notionPink:
          "border-transparent bg-[#F9F2F5] text-[#B35488] dark:bg-[#2E2328] dark:text-[#BA4A78]",
        notionRed:
          "border-transparent bg-[#FAECEC] text-[#C4554D] dark:bg-[#332523] dark:text-[#BE524B]",
        success: "bg-green-100 text-green-800",
        warning: "bg-yellow-100 text-yellow-800",
        error: "bg-red-100 text-red-800",
      },
    },
    defaultVariants: {
      variant: "notionGreen",
    },
  },
);

function Badge({
  className,
  variant,
  render,
  ...props
}: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(badgeVariants({ variant }), className),
      },
      props,
    ),
    render,
    state: {
      slot: "badge",
      variant,
    },
  });
}

export { Badge, badgeVariants };
