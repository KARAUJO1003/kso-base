import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function SwitchDemo() {
  return (
    <div className="flex items-center gap-3">
      <Switch id="switch-demo-mode" defaultChecked />
      <Label htmlFor="switch-demo-mode">Modo avião</Label>
    </div>
  );
}
