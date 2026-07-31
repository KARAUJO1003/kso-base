import { Toggle } from "@/components/ui/toggle";
import { BoldIcon } from "lucide-react";

export default function ToggleDemo() {
  return (
    <Toggle aria-label="Alternar negrito">
      <BoldIcon className="size-4" />
    </Toggle>
  );
}
