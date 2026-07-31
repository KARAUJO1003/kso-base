import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { BoldIcon, ItalicIcon, UnderlineIcon } from "lucide-react";

export default function ToggleGroupDemo() {
  return (
    <ToggleGroup>
      <ToggleGroupItem value="bold" aria-label="Alternar negrito">
        <BoldIcon className="size-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="italic" aria-label="Alternar itálico">
        <ItalicIcon className="size-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="underline" aria-label="Alternar sublinhado">
        <UnderlineIcon className="size-4" />
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
