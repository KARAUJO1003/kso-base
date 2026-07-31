"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth/hooks/use-auth";
import { ArrowRightIcon } from "lucide-react";

export function HeroCta() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <Button disabled>Carregando...</Button>;
  }

  if (isAuthenticated) {
    return (
      <Button size="lg" nativeButton={false} render={<Link href="/dashboard" />}>
        Ir para o Dashboard
        <ArrowRightIcon className="size-4" />
      </Button>
    );
  }

  return (
    <Button size="lg" nativeButton={false} render={<Link href="/login" />}>
      Entrar
      <ArrowRightIcon className="size-4" />
    </Button>
  );
}
