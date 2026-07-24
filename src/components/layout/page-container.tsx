import { cn } from "@/lib/utils";
export const PageContainer = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return <div className={cn("flex flex-col h-full", className)} {...props} />;
};

export const PageHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn("flex flex-col gap-1 px-4 md:px-6 py-3", className)}
      {...props}
    />
  );
};
export const PageHeaderGroup = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return <div className={cn("flex flex-col gap-1", className)} {...props} />;
};

export const PageTitle = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) => {
  return (
    <h1
      className={cn("font-bold text-lg lg:text-xl tracking-tight", className)}
      {...props}
    />
  );
};

export const PageDescription = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) => {
  return <p className={cn("text-muted-foreground", className)} {...props} />;
};

export const PageContent = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={cn("flex-1 px-4 md:px-6 py-4", className)} {...props} />
  );
};

export const PageFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn(
        "flex items-center gap-2 bg-background-surface-75 px-4 md:px-6 py-6 border-t",
        className,
      )}
      {...props}
    />
  );
};
