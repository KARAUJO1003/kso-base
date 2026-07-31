import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function TooltipDemo() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger render={<Button variant="outline" />}>Passe o mouse</TooltipTrigger>
        <TooltipContent>
          <p>Adicionar aos favoritos</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
