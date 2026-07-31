import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon } from "lucide-react";

export default function AlertDemo() {
  return (
    <Alert className="max-w-md">
      <AlertCircleIcon />
      <AlertTitle>Não foi possível processar seu pagamento.</AlertTitle>
      <AlertDescription>Confira os dados do cartão e tente novamente.</AlertDescription>
    </Alert>
  );
}
