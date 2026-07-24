"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { loginSchema, LoginSchema } from "../schemas/login-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginAction } from "../actions/login-action";
import { toast } from "sonner";
import { useTransition } from "react";
import { Spinner } from "@/components/ui/spinner";
import { FormFields } from "@/components/shared/form-fields";
import { BrandLogo } from "@/components/ds/brand-logo";
import { brandConfig } from "@/config/brand.config";
import { ArrowRightIcon } from "lucide-react";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [isPending, startTransition] = useTransition();
  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      login: "",
      password: "",
    },
  });

  const onSubmit = async ({ login, password }: LoginSchema) => {
    startTransition(async () => {
      const response = await loginAction({ login, password });
      if (response?.success === false) {
        toast.error(response.error || "Não foi possível realizar o login.");
      }
    });
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col items-center gap-3">
              <BrandLogo
                aria-label={brandConfig.name}
                className="w-64 max-w-full h-auto"
              />
              <h1 className="font-bold text-xl">Seja bem-vindo ao sistema.</h1>
              <div className="text-sm text-center">
                Faça login com suas credenciais abaixo.
              </div>
            </div>
            <div className="flex flex-col gap-6">
              <FormFields.Input
                name="login"
                label="Usuário ou Email"
                placeholder="Digite seu usuário ou email"
              />

              <FormFields.Input
                name="password"
                type="password"
                label="Senha"
                placeholder="Digite sua senha"
              />

              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending && <Spinner />}
                {isPending ? "Aguarde..." : "Acessar"}
                <ArrowRightIcon />
              </Button>
            </div>
          </div>
        </form>
      </Form>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-xs text-center *:[a]:underline *:[a]:underline-offset-4 text-balance">
        Ao clicar em continuar, você concorda com nossos{" "}
        <a href="#">Termos de Serviço</a> e{" "}
        <a href="#">Política de Privacidade</a>.
      </div>
    </div>
  );
}
