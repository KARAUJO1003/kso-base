import Link from "next/link";
import { cn } from "@/lib/utils";
import { PreBlock } from "./pre-block";
import { Callout } from "./callout";

function heading(Tag: "h1" | "h2" | "h3" | "h4", className: string) {
  function Heading({ className: extra, ...props }: React.ComponentProps<typeof Tag>) {
    return <Tag className={cn(className, extra)} {...props} />;
  }
  Heading.displayName = `MdxHeading(${Tag})`;
  return Heading;
}

export const mdxComponents = {
  h1: heading("h1", "scroll-m-20 text-3xl font-semibold tracking-tight mb-2"),
  h2: heading(
    "h2",
    "scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight mt-10 mb-4 first:mt-0",
  ),
  h3: heading("h3", "scroll-m-20 text-xl font-semibold tracking-tight mt-8 mb-3"),
  h4: heading("h4", "scroll-m-20 text-lg font-semibold tracking-tight mt-6 mb-2"),
  p: (props: React.ComponentProps<"p">) => (
    <p className="leading-relaxed [&:not(:first-child)]:mt-4" {...props} />
  ),
  ul: (props: React.ComponentProps<"ul">) => (
    <ul className="my-4 ml-6 list-disc space-y-1.5 [&>li]:leading-relaxed" {...props} />
  ),
  ol: (props: React.ComponentProps<"ol">) => (
    <ol className="my-4 ml-6 list-decimal space-y-1.5 [&>li]:leading-relaxed" {...props} />
  ),
  a: ({ href = "", ...props }: React.ComponentProps<"a">) => {
    const isInternal = href.startsWith("/") || href.startsWith("#");
    const className = "font-medium underline underline-offset-4 hover:text-primary";
    if (isInternal) return <Link href={href} className={className} {...(props as any)} />;
    return <a href={href} className={className} target="_blank" rel="noreferrer" {...props} />;
  },
  code: (props: React.ComponentProps<"code">) => (
    <code
      className="relative rounded bg-muted px-[0.4rem] py-[0.2rem] font-mono text-[0.85em]"
      {...props}
    />
  ),
  pre: PreBlock,
  table: (props: React.ComponentProps<"table">) => (
    <div className="my-4 w-full overflow-x-auto">
      <table className="w-full border-collapse text-sm" {...props} />
    </div>
  ),
  th: (props: React.ComponentProps<"th">) => (
    <th className="border px-3 py-2 text-left font-medium" {...props} />
  ),
  td: (props: React.ComponentProps<"td">) => <td className="border px-3 py-2" {...props} />,
  blockquote: (props: React.ComponentProps<"blockquote">) => (
    <blockquote className="mt-4 border-l-2 pl-4 italic text-muted-foreground" {...props} />
  ),
  hr: () => <hr className="my-8 border-border" />,
  Callout,
};
