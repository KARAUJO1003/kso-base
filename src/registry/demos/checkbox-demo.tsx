import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export default function CheckboxDemo() {
  return (
    <div className="flex items-center gap-3">
      <Checkbox id="checkbox-demo-terms" defaultChecked />
      <Label htmlFor="checkbox-demo-terms">Aceito os termos e condições</Label>
    </div>
  );
}
