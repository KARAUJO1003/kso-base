import { AlertTriangleIcon, InfoIcon, LightbulbIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const VARIANTS = {
  note: { icon: InfoIcon, className: "border-blue-500/30 bg-blue-500/10 text-blue-700 dark:text-blue-300" },
  warning: { icon: AlertTriangleIcon, className: "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300" },
  tip: { icon: LightbulbIcon, className: "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300" },
};

export function Callout({
  variant = "note",
  title,
  children,
}: {
  variant?: keyof typeof VARIANTS;
  title?: string;
  children: React.ReactNode;
}) {
  const { icon: Icon, className } = VARIANTS[variant];
  return (
    <div className={cn("my-4 flex gap-3 rounded-lg border p-4 text-sm", className)}>
      <Icon className="mt-0.5 size-4 shrink-0" />
      <div className="space-y-1 [&>p]:m-0 [&>p]:leading-relaxed">
        {title && <p className="font-medium">{title}</p>}
        {children}
      </div>
    </div>
  );
}
