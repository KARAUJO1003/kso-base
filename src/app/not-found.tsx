import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex-1 h-screen gap-8 flex items-center justify-center">
      <div className="flex items-center gap-8 bg-muted-foreground/10 p-16 rounded-2xl">
        <h2 className="text-9xl font-bold font-mono p-2">404</h2>
        <Separator
          orientation="vertical"
          className="max-h-24 bg-muted-foreground"
        />
        <div className="grid gap-2">
          <h3 className="text-2xl font-bold">Página não encontrada</h3>
          <p className="mb-4">
            Não foi possível encontrar o recurso solicitado
          </p>
          <Link
            className={buttonVariants({ variant: "outline" })}
            href="/"
          >
            Voltar para a página inicial
          </Link>
        </div>
      </div>
    </div>
  );
}
