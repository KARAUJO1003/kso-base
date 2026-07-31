import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function RadioGroupDemo() {
  return (
    <RadioGroup defaultValue="comfortable" className="gap-3">
      <div className="flex items-center gap-2">
        <RadioGroupItem value="default" id="radio-demo-default" />
        <Label htmlFor="radio-demo-default">Padrão</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="comfortable" id="radio-demo-comfortable" />
        <Label htmlFor="radio-demo-comfortable">Confortável</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="compact" id="radio-demo-compact" />
        <Label htmlFor="radio-demo-compact">Compacto</Label>
      </div>
    </RadioGroup>
  );
}
