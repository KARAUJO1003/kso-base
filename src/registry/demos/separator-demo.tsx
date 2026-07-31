import { Separator } from "@/components/ui/separator";

export default function SeparatorDemo() {
  return (
    <div className="max-w-xs">
      <div className="text-sm">
        <p className="font-medium">Kso Base</p>
        <p className="text-muted-foreground">Biblioteca pessoal de UI.</p>
      </div>
      <Separator className="my-4" />
      <div className="flex h-5 items-center gap-4 text-sm">
        <span>Blog</span>
        <Separator orientation="vertical" />
        <span>Docs</span>
        <Separator orientation="vertical" />
        <span>Blocks</span>
      </div>
    </div>
  );
}
